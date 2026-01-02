<?php

namespace Modules\User\App\Http\Repositories;

use Modules\Vendor\App\Http\Repositories\BaseRepository;
use Modules\User\App\Models\Order;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Notifications\ChangeOrderStatusNotification;
use Modules\Vendor\App\Models\Product;
use Modules\User\App\Models\SubOrder;
use Modules\User\App\Models\OrderItem;
use Modules\User\App\Models\commisionLog;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Mockery\Matcher\Subset;
use App\Notifications\NewOrderNotification;
use Modules\Vendor\App\Models\Vendor;
use Illuminate\Support\Str;
use Modules\Vendor\App\Models\ProductVarientes;


class OrderRepository  extends BaseRepository
{
    public $model;
    public $ProductVarientes;
    public function __construct(Order $order, ProductVarientes $ProductVarientes)
    {
        $this->model = $order;
        $this->ProductVarientes = $ProductVarientes;
        parent::__construct(Order::class);
    }

    public function get($request)
    {
        $orders = $this->model::where('user_id', auth()->id())
            ->with(['subOrders.vendor', 'subOrders.items.product', 'subOrders.items.questions', 'location', 'subOrders.items.varient', '.questions', 'user'])
            ->latest()->get();
        return $orders;
    }


    public function withPaginate($perPage, $request)
    {
        $orders = $this->model::where('user_id', auth()->id())
            ->with(['subOrders.vendor', 'subOrders.items.product', 'subOrders.items.questions', 'location', 'subOrders.items.varient', 'user'])
            ->paginate($perPage);
        return $orders;
    }

   public function checkout(User $user, array $data)
{
    return DB::transaction(function () use ($user, $data) {

        // Create main order
        $order = Order::create([
            'user_id'        => $user->id,
            'total_amount'  => 0,
            'payment_method'=> $data['payment_method'],
            'is_paid'       => false,
            'status'        => 'pending',
        ]);

        $vendorGroups = [];

        foreach ($data['items'] as $item) {

            $product  = Product::with('category')->findOrFail($item['product_id']);
            $vendorId = $product->vendor_id;

            // Price
            if (!empty($item['varient_id'])) {
                $variant = $this->ProductVarientes
                    ->where('id', $item['varient_id'])
                    ->firstOrFail();

                $price = $variant->discount_price ?? $variant->price;
            } else {
                $price = $product->discount_price ?? $product->price;
            }

            $quantity = $item['quantity'];
            $subtotal = $price * $quantity;

            $commissionPercentage = $product->category->commission ?? 0;
            $commission = ($subtotal * $commissionPercentage) / 100;

            $vendorGroups[$vendorId][] = [
                'product_id' => $product->id,
                'varient_id' => $item['varient_id'] ?? null,
                'quantity'   => $quantity,
                'price'      => $price,
                'subtotal'   => $subtotal,
                'commission' => $commission,
                'answer_ids' => $item['answer_ids'] ?? [],
            ];
        }

        $totalOrderAmount = 0;

        foreach ($vendorGroups as $vendorId => $items) {

            $subSubtotal   = array_sum(array_column($items, 'subtotal'));
            $subCommission = array_sum(array_column($items, 'commission'));

            $subOrder = SubOrder::create([
                'order_id'        => $order->id,
                'vendor_id'       => $vendorId,
                'subtotal'        => 0, // will be recalculated
                'commission'      => $subCommission,
                'total'           => 0,
                'status'          => 'pending',
                'shipping_status' => 'pending',
            ]);

            $finalSubTotal = 0;

            foreach ($items as $item) {

                $orderItem = OrderItem::create([
                    'sub_order_id' => $subOrder->id,
                    'product_id'   => $item['product_id'],
                    'varient_id'   => $item['varient_id'],
                    'quantity'     => $item['quantity'],
                    'price'        => $item['price'],
                    'total'        => 0,
                ]);

                $itemTotal = $item['price'];

                // Handle answers
                if (!empty($item['answer_ids'])) {

                    $orderQuestionService = new \Modules\User\App\Http\Services\OrderQuestionService();
                    $orderQuestions = $orderQuestionService
                        ->saveOrderItemQuestions($orderItem->id, $item['answer_ids']);

                    $collection = collect($orderQuestions);

                    $fixedTotal = $collection
                        ->where('price_effect_type', 'fixed')
                        ->sum('price_effect');

                    $percentageTotal = $collection
                        ->where('price_effect_type', 'percentage')
                        ->sum('price_effect');

                    $answersPrice = $fixedTotal + (($item['price'] * $percentageTotal) / 100);

                    $itemTotal += $answersPrice;
                }

                $itemTotal *= $item['quantity'];

                $orderItem->update([
                    'total' => $itemTotal
                ]);

                $finalSubTotal += $itemTotal;
            }

            $subOrder->update([
                'subtotal' => $finalSubTotal,
                'total'    => $finalSubTotal - $subCommission,
            ]);

            $totalOrderAmount += $subOrder->total;
        }

        // Save location
        $order->location()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'full_name'        => $data['location']['full_name'],
                'phone'            => $data['location']['phone'],
                'city'             => $data['location']['city'],
                'area'             => $data['location']['area'] ?? null,
                'street'           => $data['location']['street'] ?? null,
                'building_number'  => $data['location']['building_number'] ?? null,
                'floor_number'     => $data['location']['floor_number'] ?? null,
                'apartment_number' => $data['location']['apartment_number'] ?? null,
                'landmark'         => $data['location']['landmark'] ?? null,
                'notes'            => $data['location']['notes'] ?? null,
                'order_id'         => $order->id,
            ]
        );

        $order->update([
            'total_amount'         => $totalOrderAmount,
            'transportation_price' => $data['transportation_price'],
        ]);

        // Notify vendors
        foreach ($vendorGroups as $vendorId => $items) {
            $vendor = Vendor::find($vendorId);
            if ($vendor) {
                $subOrder = SubOrder::where('order_id', $order->id)
                    ->where('vendor_id', $vendorId)
                    ->first();

                $vendor->notify(new NewOrderNotification($subOrder));
            }
        }

        return $order;
    });
}



    public function show($id)
    {
        $order = Order::with(['subOrders.vendor', 'subOrders.items.product', 'subOrders.items.questions', 'location', 'subOrders.items.varient', 'user'])
            ->where('user_id', auth()->id())
            ->find($id);

        return $order;
    }


    public function cancel($id)
    {
        $order = Order::where('user_id', auth()->id())
            ->where('status', 'pending')
            ->find($id);

        if (!$order) return false;
        // Optional: check if shipped أي SubOrder بدأ شحنه
        $shipped = $order->subOrders()->where('shipping_status', 'shipped')->exists();
        if ($shipped) {
            // return response()->json(['message' => 'Cannot cancel: some items already shipped.'], 400);
            return false;
        }

        $order->update(['status' => 'cancelled']);
        $order->subOrders()->update(['status' => 'cancelled', 'shipping_status' => 'cancelled']);

        return true;
        // response()->json(['message' => 'Order cancelled successfully.']);
    }

    public function vendorOrders($request)
    {
        $vendorId = auth()->user()->vendor_id;
        // return $request;
        $orders = SubOrder::where(function ($q) use ($request) {
            if (isset($request['status']) && $request['status'] != null) {
                $q->where('status', $request['status']);
            }

            if (isset($request['shipping_status']) && $request['shipping_status'] != null) {
                $q->where('shipping_status', $request['shipping_status']);
            }


            if (isset($request['tracking_number']) && $request['tracking_number'] != null) {
                $q->where('tracking_number', $request['tracking_number']);
            }


            if (isset($request['from_date']) && $request['from_date'] != null) {
                $q->whereDate('created_at', '>=', $request['from_date']);
            }


            if (isset($request['to_date']) && $request['to_date'] != null) {
                $q->whereDate('created_at', '<=', $request['to_date']);
            }
        })->with(['order.user', 'items.product', 'order.location', 'items.varient', 'items.questions', 'user'])
            ->where('vendor_id', $vendorId)
            ->latest()
            ->get();

        return $orders;
    }

    public function vendorOrdersWithPaginate($perPage, $request)
    {
        $vendorId = auth()->user()->vendor_id;
        // return "0";
        $orders = SubOrder::where(function ($q) use ($request) {
            if (isset($request['status']) && $request['status'] != null) {
                $q->where('status', $request['status']);
            }

            if (isset($request['shipping_status']) && $request['shipping_status'] != null) {
                $q->where('shipping_status', $request['shipping_status']);
            }


            if (isset($request['tracking_number']) && $request['tracking_number'] != null) {
                $q->where('tracking_number', $request['tracking_number']);
            }



            if (isset($request['from_date']) && $request['from_date'] != null) {
                $q->whereDate('created_at', '>=', $request['from_date']);
            }


            if (isset($request['to_date']) && $request['to_date'] != null) {
                $q->whereDate('created_at', '<=', $request['to_date']);
            }
        })->with(['order.user', 'items.product', 'order.location', 'items.varient', 'items.questions'])
            ->where('vendor_id', $vendorId)
            ->latest()
            ->paginate($perPage);

        return $orders;
    }

    public function ship($request, $id)
    {
        $subOrder = $this->model::find($id);

        $subOrder->update(attributes: [
            'status' => 'shipped',
            'tracking_number' => Str::random(10),
            'delivered_at' => $request->estimated_delivery_date,
        ]);



        $order = Order::find($id);
        $user = User::find($order->user_id);

        $user->notify(new ChangeOrderStatusNotification($subOrder));

        return $subOrder;
    }


    public function vendorCancel($id)
    {
        $order = SubOrder::where('id', $id)->where('status', 'pending')
            ->where('vendor_id', auth()->user()->vendor->id)
            ->first();

        // return $order;
        if (!$order) return false;
        // Optional: check if shipped أي SubOrder بدأ شحنه
        $shipped = SubOrder::where('id', $id)->where('shipping_status', 'shipped')->exists();
        // return $shipped;
        if ($shipped) {
            // return response()->json(['message' => 'Cannot cancel: some items already shipped.'], 400);
            return false;
        }

        $order->update(['status' => 'cancelled']);
        $order->update(['shipping_status' => 'cancelled']);
        // $order->update(['status' => 'cancelled']);

        $order = Order::find($order->order_id);
        $user = User::find($order->user_id);

        // $user->notify(new ChangeOrderStatusNotification($order));

        return true;
        // response()->json(['message' => 'Order cancelled successfully.']);
    }


    public function getOrderCount()
    {
        $vendor_id = Auth::user()->vendor_id;
        return SubOrder::where('vendor_id', $vendor_id)->count();
    }

    public function getAllOrderCount()
    {
        return $this->model::count();
    }

    public function getOrderCountByMonth()
    {
        $vendor_id = Auth::user()->vendor_id;
        $orders = SubOrder::select(
            DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
            DB::raw('COUNT(*) as count')
        )
            ->where('vendor_id', $vendor_id)
            ->whereYear('created_at', Carbon::now()->year)
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get()
            ->pluck('count', 'month');

        $allMonths = [];
        $year = Carbon::now()->year;
        for ($month = 1; $month <= Carbon::now()->month; $month++) {
            $key = sprintf('%d-%02d', $year, $month);
            $allMonths[$key] = isset($orders[$key]) ? $orders[$key] : 0;
        }
        return $allMonths;
    }



    public function getAllOrderCountByMonth()
    {
        // $vendor_id = Auth::user()->vendor_id;
        $orders = $this->model::select(
            DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
            DB::raw('COUNT(*) as count')
        )
            // ->where('vendor_id', $vendor_id)
            ->whereYear('created_at', Carbon::now()->year)
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get()
            ->pluck('count', 'month');

        $allMonths = [];
        $year = Carbon::now()->year;
        for ($month = 1; $month <= Carbon::now()->month; $month++) {
            $key = sprintf('%d-%02d', $year, $month);
            $allMonths[$key] = isset($orders[$key]) ? $orders[$key] : 0;
        }
        return $allMonths;
    }

    public function recentOrder()
    {
        $vendor_id = Auth::user()->vendor_id;
        return SubOrder::where('vendor_id', $vendor_id)
            ->with(['vendor', 'items.product', 'items.varient', 'items.questions'])
            ->latest()
            ->take(5)
            ->get();
    }


    public function recentAllOrder()
    {
        // $vendor_id = Auth::user()->vendor_id;
        return $this->model::with(['subOrders.items.product', 'location', 'subOrders.items.varient', 'user', 'subOrders.items.questions'])
            ->latest()
            ->take(5)
            ->get();
    }

    public function getOrderReport($request)
    {
        $vendor_id = Auth::user()->vendor_id;
        //Order Count

        $orderCount = SubOrder::where('vendor_id', $vendor_id)
            ->where(function ($q) use ($request) {
                if (isset($request['start_date']) && $request['start_date'] != '') {
                    $q->whereDate('created_at', '>=', $request->start_date);
                }

                if (isset($request['end_date']) && $request['end_date'] != '') {
                    $q->whereDate('created_at', '<=', $request->end_date);
                }
            })
            ->count();

        //Delivered Orders Count
        $deliveredOrdersCount = SubOrder::where('vendor_id', $vendor_id)
            ->where(function ($q) use ($request) {
                if (isset($request['start_date']) && $request['start_date'] != '') {
                    $q->whereDate('created_at', '>=', $request->start_date);
                }

                if (isset($request['end_date']) && $request['end_date'] != '') {
                    $q->whereDate('created_at', '<=', $request->end_date);
                }
            })
            ->where('status', 'delivered')
            ->count();


        //cancelled Orders Count

        $cancelledOrdersCount = SubOrder::where('vendor_id', $vendor_id)
            ->where(function ($q) use ($request) {
                if (isset($request['start_date']) && $request['start_date'] != '') {
                    $q->whereDate('created_at', '>=', $request->start_date);
                }

                if (isset($request['end_date']) && $request['end_date'] != '') {
                    $q->whereDate('created_at', '<=', $request->end_date);
                }
            })

            ->where('status', 'cancelled')
            ->count();

        $totalItemsSold = SubOrder::where('vendor_id', $vendor_id)
            ->where(function ($q) use ($request) {
                if (isset($request['start_date']) && $request['start_date'] != '') {
                    $q->whereDate('created_at', '>=', $request->start_date);
                }

                if (isset($request['end_date']) && $request['end_date'] != '') {
                    $q->whereDate('created_at', '<=', $request->end_date);
                }
            })
            ->with(['items'])
            ->get()
            ->sum(function ($subOrder) {
                return $subOrder->items->sum('quantity');
            });
        $averageOrderValue = SubOrder::where('vendor_id', $vendor_id)
            ->where(function ($q) use ($request) {
                if (isset($request['start_date']) && $request['start_date'] != '') {
                    $q->whereDate('created_at', '>=', $request->start_date);
                }

                if (isset($request['end_date']) && $request['end_date'] != '') {
                    $q->whereDate('created_at', '<=', $request->end_date);
                }
            })
            ->with(['items'])
            ->get()
            ->sum(function ($subOrder) {
                return $subOrder->items->sum('total');
            }) / ($orderCount == 0 ? 1 : $orderCount);
        $data['orderCount'] = $orderCount;
        $data['deliveredOrdersCount'] = $deliveredOrdersCount;
        $data['cancelledOrdersCount'] = $cancelledOrdersCount;
        $data['totalItemsSold'] = $totalItemsSold;
        $data['averageOrderValue'] = $averageOrderValue;

        return $data;
    }



    public function getAllOrder($request)
    {
        return $this->model::where(function ($q) use ($request) {
            if (isset($request['status']) && $request['status'] != null) {
                $q->where('status', $request['status']);
            }

            if (isset($request['shipping_status']) && $request['shipping_status'] != null) {
                $q->where('shipping_status', $request['shipping_status']);
            }

            if (isset($request['vendor_id']) && $request['vendor_id'] != null) {
                $q->whereHas('subOrders', function ($query) use ($request) {
                    $query->where('vendor_id', $request['vendor_id']);
                });
            }

            if (isset($request['tracking_number']) && $request['tracking_number'] != null) {
                $q->where('tracking_number', $request['tracking_number']);
            }

            if (isset($request['from_date']) && $request['from_date'] != null) {
                $q->whereDate('created_at', '>=', $request['from_date']);
            }

            if (isset($request['to_date']) && $request['to_date'] != null) {
                $q->whereDate('created_at', '<=', $request['to_date']);
            }
        })->with(['subOrders.vendor', 'subOrders.items.product', 'subOrders.items.questions', 'location', 'subOrders.items.varient', 'user'])->get();
    }

    public function getAllOrderWithPaginate($perPage, $request)
    {
        return $this->model::where(function ($q) use ($request) {
            if (isset($request['status']) && $request['status'] != null) {
                $q->where('status', $request['status']);
            }

            if (isset($request['shipping_status']) && $request['shipping_status'] != null) {
                $q->where('shipping_status', $request['shipping_status']);
            }

            if (isset($request['vendor_id']) && $request['vendor_id'] != null) {
                $q->whereHas('subOrders', function ($query) use ($request) {
                    $query->where('vendor_id', $request['vendor_id']);
                });
            }

            if (isset($request['tracking_number']) && $request['tracking_number'] != null) {
                $q->where('tracking_number', $request['tracking_number']);
            }

            if (isset($request['from_date']) && $request['from_date'] != null) {
                $q->whereDate('created_at', '>=', $request['from_date']);
            }

            if (isset($request['to_date']) && $request['to_date'] != null) {
                $q->whereDate('created_at', '<=', $request['to_date']);
            }
        })->with(['subOrders.vendor', 'subOrders.items.product', 'subOrders.items.questions', 'location', 'subOrders.items.varient', 'user'])
            ->paginate($perPage);
    }


    public function getOrderById($id)
    {
        return $this->model::where('id', $id)
            ->with(['subOrders.vendor', 'subOrders.items.product', 'subOrders.items.questions', 'location', 'subOrders.items.varient', 'user'])
            ->first();
    }

    public function cancelOrderById($id)
    {
        $order = $this->model::where('id', $id)
            ->where('status', 'pending')
            ->first();

        if (!$order) return false;

        // Optional: check if shipped أي SubOrder بدأ شحنه
        $shipped = $order->subOrders()->where('status', 'shipped')->exists();
        // return $shipped;
        Log::info($shipped);
        if ($shipped) {
            return false;
        }

        $order->update(['status' => 'cancelled']);
        $order->subOrders()->update(['status' => 'cancelled', 'shipping_status' => 'cancelled']);

        return true;
    }
}
