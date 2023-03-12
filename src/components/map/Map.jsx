import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Input,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import "./map.css";
import ClearIcon from "@mui/icons-material/Clear";
import NearMeIcon from "@mui/icons-material/NearMe";
import {
  useJsApiLoader,
  GoogleMap,
  MarkerF,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";

const Map = ({ defaultCenter }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API,
    libraries: ["places"],
  });

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionRes, setDirectionRes] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  const [center, setCenter] = useState(null);
  useEffect(() => {
    const getCoords = async () => {
      const results = await geocodeByAddress(defaultCenter);
      const latlng = await getLatLng(results[0]);
      setCenter(latlng);
    };
    getCoords();
  }, [defaultCenter]);

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();

  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef();
  if (!isLoaded) {
    return <Skeleton />;
  }

  const calculateRoute = async () => {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();

    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,

      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionRes(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  };

  const clearRoute = () => {
    setDirectionRes(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destinationRef.current.value = "";
  };
  return (
    <div className="mapContainer">
      <Box
        p={4}
        borderRadius="5px"
        border="1px solid #ccc"
        //   mt={4}
        bgcolor="white"
        shadow="base"
        width="659px"
      >
        <Stack
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <div className="mapInput">
            <Box flexGrow={1}>
              <Autocomplete>
                <Input
                  type="text"
                  placeholder="Start"
                  inputRef={originRef}
                  sx={{ width: "500px" }}
                />
              </Autocomplete>
            </Box>
            <Box flexGrow={1}>
              <Autocomplete>
                <Input
                  type="text"
                  placeholder="Destination"
                  inputRef={destinationRef}
                  defaultValue={defaultCenter}
                  sx={{ width: "500px" }}
                />
              </Autocomplete>
            </Box>
          </div>
          <ButtonGroup variant="outlined" sx={{ gap: "5px" }}>
            <Button
              type="submit"
              variant="contained"
              onClick={calculateRoute}
              size="small"
            >
              Direction
            </Button>
            <IconButton
              aria-label="center back"
              color="error"
              onClick={clearRoute}
              size="small"
            >
              <ClearIcon />
            </IconButton>
          </ButtonGroup>
        </Stack>
        <Stack
          mt={4}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Typography>Distance: {distance}</Typography>
          <Typography>Duration: {duration}</Typography>
          <IconButton
            aria-label="center back"
            onClick={() => map.panTo(center)}
          >
            <NearMeIcon />
          </IconButton>
        </Stack>
      </Box>
      <Box border="1px solid #ccc" mb={2}>
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: "723px", height: "400px" }}
          onLoad={(map) => setMap(map)}
        >
          <MarkerF position={center} />
          {directionRes && <DirectionsRenderer directions={directionRes} />}
        </GoogleMap>
      </Box>
    </div>
  );
};

export default Map;
