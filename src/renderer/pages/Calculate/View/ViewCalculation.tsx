import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "../../../components/Navigation";
import { ClipLoader } from "react-spinners";
import { useCalculations } from "../../../hooks/useCalculations";
import { Calculation } from "../../../../types/calculation";
import Header from "./components/Header";
import IncomeSources from "./components/IncomeSources";
import Footer from "./components/Footer";
import TaxableIncome from "./components/TaxableIncome";
import GrossIncomeTax from "./components/GrossIncomeTax";
import TotalPayableTax from "./components/TotalPayableTax";
import BalancePayableTax from "./components/BalancePayableTax";
import Error from "../../../components/Error";

const ViewCalculation = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const calculationId = id ? parseInt(id) : null;

  const [calculation, setCalculation] = useState<Calculation | null>(null);
  const { getCalculationById, loading, error } = useCalculations();

  useEffect(() => {
    const fetchCalculation = async () => {
      if (!calculationId) {
        navigate("/history");
        return;
      }

      const fetchedCalculation = await getCalculationById(calculationId);
      if (fetchedCalculation) {
        setCalculation(fetchedCalculation);
      }
    };

    fetchCalculation();
  }, [calculationId, getCalculationById, navigate]);

  const reloadCalculationData = async () => {
    const fetchedCalculation = await getCalculationById(calculationId);
    if (fetchedCalculation) {
      setCalculation(fetchedCalculation);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <Navigation title="View Calculation" />
        <div className="flex h-96 items-center justify-center">
          <ClipLoader color="#4A90E2" size={40} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Navigation title="View Calculation" />

      {!calculation ? (
        <Error
          title="Failed to load calculation data"
          message={error}
          onRetry={reloadCalculationData}
        />
      ) : (
        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* Header Component */}
          <Header calculation={calculation} />

          {/* Income Sources Section */}
          <IncomeSources calculation={calculation} />

          {/* Taxable Income Section */}
          <TaxableIncome calculation={calculation} />

          {/* Gross income tax section */}
          <GrossIncomeTax calculation={calculation} />

          {/* Total Payable Tax and Balance Payable Tax Section */}
          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <TotalPayableTax calculation={calculation} />
            <BalancePayableTax calculation={calculation} />
          </div>

          {/* Metadata */}
          <Footer calculation={calculation} />
        </div>
      )}
    </div>
  );
};

export default ViewCalculation;
