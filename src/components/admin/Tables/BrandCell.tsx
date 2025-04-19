type Props = {
  name: string;
  image: string;
};
const BrandCell = ({ name, image }: Props) => {
  return (
    <div className="flex items-center gap-3">
      <img
        src={image}
        alt={name}
        className="w-10 h-10 rounded-full object-cover border border-gray shadow-sm"
      />
      <span className="font-medium text-gray-800  dark:text-gray-100 text-sm ">
        {name}
      </span>
    </div>
  );
};

export default BrandCell;
