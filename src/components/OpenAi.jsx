import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Spinner from "./Spinner";
import { Typography } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { getEventApi, suggestApi } from "../api/blogs";

export default function OpenAi() {
  const [openFirst, setOpenFirst] = React.useState(false);
  const [firstLoading, setFirstLoading] = React.useState(false);
  const [first, setFirst] = React.useState("");

  const handleClickOpenFirst = async () => {
    setOpenFirst(true);
  };

  const firstSubmit = async (city, question, temperature, weather) => {
    const res = await suggestApi(city, question, temperature, weather);
    if (res.data) {
      setFirst(res.data);
      setFirstLoading(false);
      return;
    } else {
      setFirstLoading(false);
      alert(res.response.data.message);
      return;
    }
  };

  const handleCloseFirst = () => {
    setOpenFirst(false);
    setFirst("");
    setLocation("");
  };

  const [openSecond, setOpenSecond] = React.useState(false);
  const [secondLoading, setSecondLoading] = React.useState(false);
  const [second, setSecond] = React.useState([]);

  const secondSubmit = async (question) => {
    const res = await getEventApi(question);
    if (res.data) {
      setSecond(res.data);
      setSecondLoading(false);
      return;
    } else {
      setSecondLoading(false);
      alert(res.response.data.message);
      return;
    }
  };

  const handleClickOpenSecond = () => {
    setOpenSecond(true);
  };

  const handleCloseSecond = () => {
    setOpenSecond(false);
    setSecond([]);
    setLocation("");
  };

  const [location, setLocation] = React.useState("");
  const [address, setAddress] = React.useState({});

  const getAddress = async () => {
    const res = await axios({ url: "https://ipapi.co/json/", method: "GET" });
    if (res && res.data) {
      setAddress(res.data);
    } else {
      alert("trouble finding your location");
    }
  };

  const getLocation = () => {
    if (address && address.region) {
      setLocation(`${address.city}, ${address.region}`);
    } else {
      alert(
        "Cannot access your location. You might have been blocked loaciton for the browser. Please allow loaction to see your current location"
      );
    }
  };

  useEffect(() => {
    getAddress();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="dropdown">
        <button
          className="btn btn-outline-primary btn-sm dropdown-toggle"
          style={{ width: "auto" }}
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Open AI
        </button>

        <ul className="dropdown-menu">
          <li>
            <a
              className="dropdown-item"
              //   href="/"
              onClick={handleClickOpenFirst}
            >
              Suggest Activities
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              //   href="/"
              onClick={handleClickOpenSecond}
            >
              Real time events
            </a>
          </li>
        </ul>

        <Dialog
          open={openFirst}
          onClose={handleCloseFirst}
          PaperProps={{
            component: "form",
            onSubmit: async (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(formData.entries());
              const question = formJson.question;
              if (address && address.city) {
                setFirstLoading(true);
                const res = await axios.get(
                  `https://api.openweathermap.org/data/2.5/onecall?lat=${address.latitude}&lon=${address.longitude}&exclude=minutely&units=metric&appid=117bfe6be263d54afb55f47b46b6daf1`
                );
                firstSubmit(
                  address.city,
                  question,
                  res.data.current.temp,
                  res.data.daily[0].weather[0].main
                );
              } else {
                alert("trouble finding your location");
              }
            },
          }}
        >
          <DialogTitle
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            {"Suggest Activities"}
            <Button
              variant="outlined"
              sx={{ width: "auto" }}
              onClick={() => getLocation()}
            >
              Get current location
            </Button>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Recommend activities based on current weather conditions.
            </DialogContentText>
            <TextField
              autoFocus
              required
              fullWidth
              placeholder="Search event"
              size="small"
              name="question"
            />
            {location !== "" && (
              <Typography sx={{ mt: 1, mb: 1 }}>
                Your current location is {location}
              </Typography>
            )}
            {firstLoading ? (
              <Spinner />
            ) : (
              <Typography sx={{ mt: 1, mb: 1 }}>{first}</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseFirst} sx={{ width: "auto" }}>
              Cancel
            </Button>
            <Button type="submit" sx={{ width: "auto" }}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openSecond}
          onClose={handleCloseSecond}
          PaperProps={{
            component: "form",
            onSubmit: async (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(formData.entries());
              const question = formJson.question;
              setSecondLoading(true);
              secondSubmit(question);
            },
          }}
        >
          <DialogTitle
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            {"Current Events"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Search real-time events / search (current sports events).
            </DialogContentText>
            <TextField
              autoFocus
              required
              fullWidth
              placeholder="Search event"
              size="small"
              name="question"
            />
            {secondLoading ? (
              <Spinner />
            ) : (
              second &&
              second.length > 0 &&
              second.map((done) => (
                <Typography key={done.title} sx={{ mt: 1, mb: 1 }}>
                  <a
                    target="_blank"
                    href={done.link}
                    rel="noreferrer"
                    className="text-black no-underline"
                  >
                    {done.title}
                  </a>
                </Typography>
              ))
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSecond} sx={{ width: "auto" }}>
              Cancel
            </Button>
            <Button type="submit" sx={{ width: "auto" }}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
