import { Calculation } from "../../../../../types/calculation";
import { Text } from '@radix-ui/themes';

interface FooterProps {
    calculation: Calculation;
}

const Footer = ({ calculation }: FooterProps) => {
    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <Text className="text-gray-400 text-sm mr-4">Created</Text>
                    <Text className="text-white">
                        {new Date(calculation.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </Text>
                </div>
                <div>
                    <Text className="text-gray-400 text-sm mr-4">Last Updated</Text>
                    <Text className="text-white">
                        {new Date(calculation.updatedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </Text>
                </div>
            </div>
        </div>
    )
}

export default Footer;