import { motion } from "framer-motion";

interface Item {
  title: string;
  subtitle: string;
  imageUrls: string[];
}

interface Props {
  items: Item[];
}

export const MultiImagesBanner: React.FC<Props> = ({ items }) => {
  return (
    <div className="flex flex-wrap justify-center gap-6 p-6 my-10 bg-[#f9f4ef]">
      {items.map((item, index) => (
        <motion.div
          key={index}
          className={`w-1/${
            items.length + 1
          } rounded-2xl shadow-lg p-4 text-center`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2, duration: 0.5 }}
        >
          <div className="flex justify-center gap-4">
            {item.imageUrls.map((url, i) => (
              <motion.img
                key={i}
                src={url}
                className="w-full h-full object-contain rounded-md"
                whileHover={{ scale: 1.1, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
