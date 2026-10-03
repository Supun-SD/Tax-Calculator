import { Calculation } from "../../../../../types/calculation";
import { Text } from "@radix-ui/themes";

interface FooterProps {
  calculation: Calculation;
}

const Footer = ({ calculation }: FooterProps) => {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Text className="mr-4 text-sm text-gray-400">Created</Text>
          <Text className="text-white">
            {new Date(calculation.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </div>
        <div>
          <Text className="mr-4 text-sm text-gray-400">Last Updated</Text>
          <Text className="text-white">
            {new Date(calculation.updatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Footer;
