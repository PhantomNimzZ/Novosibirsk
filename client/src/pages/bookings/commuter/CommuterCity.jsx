import { useParams, useNavigate } from "react-router-dom";
import PageContainer from "../../../components/ui/PageContainer";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import CityMapPreview from "../../../components/maps/CityMapPreview";

const CommuterCity = () => {
  const { cityId } = useParams();
  const navigate = useNavigate();

  const cityNames = {
    "cape-town": "Cape Town",
    "johannesburg": "Johannesburg",
    "durban": "Durban",
  };

  const cityName = cityNames[cityId] || "Unknown City";

  const handleSelectRoute = () => {
    navigate(`/book?city=${cityId}`);
  };

  return (
    <PageContainer title={`Commuter Routes – ${cityName}`}>
      <div className="flex flex-col gap-8">

        {/* Map Section */}
        <div className="w-full rounded-xl overflow-hidden shadow-md border border-gray-200">
          <CityMapPreview cityId={cityId} />
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Available Routes
          </h2>

          <p className="text-gray-600 mb-6">
            View the available commuter train routes in {cityName}.  
            Select a route to continue with your booking.
          </p>

          <PrimaryButton onClick={handleSelectRoute} className="w-full">
            Select Route
          </PrimaryButton>
        </div>
      </div>
    </PageContainer>
  );
};

export default CommuterCity;
