import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../../../components/Navigation';
import { Text } from '@radix-ui/themes';
import { ClipLoader } from 'react-spinners';
import { useCalculations } from '../../../hooks/useCalculations';
import { Calculation } from '../../../../types/calculation';
import Header from './components/Header';
import IncomeSources from './components/IncomeSources';
import Footer from './components/Footer';

const ViewCalculation = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const calculationId = id ? parseInt(id) : null;

    const [calculation, setCalculation] = useState<Calculation | null>(null);
    const { getCalculationById, loading } = useCalculations();

    useEffect(() => {
        const fetchCalculation = async () => {
            if (!calculationId) {
                navigate('/history');
                return;
            }

            const fetchedCalculation = await getCalculationById(calculationId);
            if (fetchedCalculation) {
                setCalculation(fetchedCalculation);
            } else {
                navigate('/history');
            }
        };

        fetchCalculation();
    }, [calculationId, getCalculationById, navigate]);



    if (loading) {
        return (
            <div className="p-8">
                <Navigation title="View Calculation" />
                <div className="flex justify-center items-center h-96">
                    <ClipLoader color="#4A90E2" size={40} />
                </div>
            </div>
        );
    }

    if (!calculation) {
        return (
            <div className="p-8">
                <Navigation title="View Calculation" />
                <div className="flex justify-center items-center h-96">
                    <Text className="text-white text-xl">Calculation not found</Text>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <Navigation title="View Calculation" />
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header Component */}
                <Header calculation={calculation} />


                {/* Income Sources Section */}
                <IncomeSources calculation={calculation} />

                {/* Metadata */}
                <Footer calculation={calculation} />
            </div>
        </div>
    );
};

export default ViewCalculation;
