import React, { useState, useEffect } from 'react';
import { Text, Separator } from '@radix-ui/themes';

const QRT = () => {
    const [quarterlyValues, setQuarterlyValues] = useState({
        qrt1: 25000.00,
        qrt2: 0.00,
        qrt3: 0.00,
        qrt4: 0.00
    });
    const [total, setTotal] = useState(25000.00);

    useEffect(() => {
        const sum = quarterlyValues.qrt1 + quarterlyValues.qrt2 + quarterlyValues.qrt3 + quarterlyValues.qrt4;
        setTotal(sum);
    }, [quarterlyValues]);

    const handleInputChange = (quarter: keyof typeof quarterlyValues, value: string) => {
        const numValue = parseFloat(value) || 0;
        setQuarterlyValues(prev => ({
            ...prev,
            [quarter]: numValue
        }));
    };

    return (
        <div className="h-full flex flex-col">
            <Text className='text-white pl-3' size="4" weight="bold">QRT</Text>
            <Separator className="w-full mt-3 bg-surface-2" />
            <div className='text-white bg-surface mt-4 p-8 rounded-2xl flex-1 flex flex-col'>
                <div className="space-y-4 flex-1">
                    {/* 1st QRT */}
                    <div className="flex justify-between items-center">
                        <Text className="text-white">1st QRT</Text>
                        <div className="bg-surface-2 rounded-lg px-4 py-2 min-w-[120px]">
                            <input
                                type="number"
                                value={quarterlyValues.qrt1}
                                onChange={(e) => handleInputChange('qrt1', e.target.value)}
                                className="bg-transparent text-white text-right w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                step="0.01"
                            />
                        </div>
                    </div>

                    {/* 2nd QRT */}
                    <div className="flex justify-between items-center">
                        <Text className="text-white">2nd QRT</Text>
                        <div className="bg-surface-2 rounded-lg px-4 py-2 min-w-[120px]">
                            <input
                                type="number"
                                value={quarterlyValues.qrt2}
                                onChange={(e) => handleInputChange('qrt2', e.target.value)}
                                className="bg-transparent text-white text-right w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                step="0.01"
                            />
                        </div>
                    </div>

                    {/* 3rd QRT */}
                    <div className="flex justify-between items-center">
                        <Text className="text-white">3rd QRT</Text>
                        <div className="bg-surface-2 rounded-lg px-4 py-2 min-w-[120px]">
                            <input
                                type="number"
                                value={quarterlyValues.qrt3}
                                onChange={(e) => handleInputChange('qrt3', e.target.value)}
                                className="bg-transparent text-white text-right w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                step="0.01"
                            />
                        </div>
                    </div>

                    {/* 4th QRT */}
                    <div className="flex justify-between items-center">
                        <Text className="text-white">4th QRT</Text>
                        <div className="bg-surface-2 rounded-lg px-4 py-2 min-w-[120px]">
                            <input
                                type="number"
                                value={quarterlyValues.qrt4}
                                onChange={(e) => handleInputChange('qrt4', e.target.value)}
                                className="bg-transparent text-white text-right w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                step="0.01"
                            />
                        </div>
                    </div>
                </div>

                {/* Total */}
                <div className="mt-6 bg-green-600/20 border border-green-500/30 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <Text className="text-white font-semibold">Total</Text>
                        <Text className="text-white font-bold text-lg">
                            Rs. 4,500,000.00
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRT;
