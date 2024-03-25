import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  Avatar,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { deepOrange } from "@mui/material/colors";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import {
  disableUser,
  enableUser,
  getAllUsers,
  getUserApi,
} from "../api/authentication";
import { createBlogApi } from "../api/blogs";

function Header({ sections, title }) {
  const [hide, setHide] = useState(true);
  const location = useLocation();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setHide(true);
    } else {
      setHide(false);
    }
  }, [location]);

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/login");
    location.reload();
  };

  const [open, setOpen] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAddPost({
      id: Math.floor(Math.random() * 1000000),
      title: "",
      description: "",
      cover: "",
      authorName: "",
      createdAt: "",
      category: "",
      authorAvatar: require("../assets/author.jpg"),
      likes: 0,
      comments: [],
    });
  };

  const [addPost, setAddPost] = useState({
    title: "",
    description: "",
    cover: "",
    authorName: "",
    createdAt: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddPost({ ...addPost, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await createBlogApi(addPost);
    if (res.data) {
      handleClose();
      // window.location.reload();
      const path = addPost.category.toLowerCase();
      navigate(`/${path}`);
    } else {
      alert(res.response.data.message);
    }
  };

  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const getUser = async () => {
    if (localStorage.getItem("token")) {
      const res = await getUserApi();
      if (res.data) {
        setUser(res.data);
      } else {
        alert(res.response.data.message);
      }
      if (res.data.role === "Administrator") {
        let resp = await getAllUsers();
        if (resp.data) {
          setUsers(resp.data);
        } else {
          alert(resp.response.data.message);
        }
      }
    }
  };

  const fetchUsers = async () => {
    let resp = await getAllUsers();
    if (resp.data) {
      setUsers(resp.data);
    } else {
      alert(resp.response.data.message);
    }
  };
  
  const handleEnableDisableUser = async (userId, enable) => {
    if (enable) {
      await enableUser(userId);
    } else {
      await disableUser(userId);
    }
    // Refetch users after enabling/disabling user
    fetchUsers();
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUser();
    }
  }, []);

  return (
    <>
      {!hide && (
        <>
          <Toolbar sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Button size="small">Subscribe</Button>
            <Typography
              component="h2"
              variant="h5"
              color="inherit"
              align="center"
              noWrap
              sx={{ flex: 1 }}
            >
              <Link to={"/"} style={{ color: "black", textDecoration: "none" }}>
                {title}
              </Link>
            </Typography>
            <Button
              sx={{ width: "auto" }}
              // color="secondary"
              className="mx-2"
              variant="outlined"
              size="small"
              onClick={handleClickOpen}
            >
              Create Post
            </Button>
            <Dialog
              fullScreen={fullScreen}
              open={open}
              onClose={handleClose}
              aria-labelledby="responsive-dialog-title"
            >
              <DialogTitle id="responsive-dialog-title">
                {"Add a Blog"}
              </DialogTitle>
              <form onSubmit={handleSubmit}>
                <DialogContent>
                  <TextField
                    className={"my-2"}
                    fullWidth
                    label="Title"
                    variant="outlined"
                    value={addPost.title}
                    name="title"
                    onChange={(e) => handleChange(e)}
                    required
                    size="small"
                  />
                  <TextField
                    className={"my-2"}
                    fullWidth
                    label="Description"
                    variant="outlined"
                    value={addPost.description}
                    name="description"
                    onChange={(e) => handleChange(e)}
                    required
                    size="small"
                  />
                  <TextField
                    className={"my-2"}
                    fullWidth
                    // label="Date Published"
                    variant="outlined"
                    value={addPost.createdAt}
                    name="createdAt"
                    onChange={(e) => handleChange(e)}
                    required
                    type="date"
                    size="small"
                  />
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">
                      Category
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Category"
                      name="category"
                      value={addPost.category}
                      onChange={(e) => handleChange(e)}
                    >
                      <MenuItem value="Academic">Academic</MenuItem>
                      <MenuItem value="Career">Career</MenuItem>
                      <MenuItem value="Campus">Campus</MenuItem>
                      <MenuItem value="Culture">Culture</MenuItem>
                      <MenuItem value="Local Community">
                        Local Community
                      </MenuItem>
                      <MenuItem value="Social">Social</MenuItem>
                      <MenuItem value="Sports">Sports</MenuItem>
                      <MenuItem value="Health and Wellness">
                        Health and Wellness
                      </MenuItem>
                      <MenuItem value="Technology">Technology</MenuItem>
                      <MenuItem value="Travel">Travel</MenuItem>
                      <MenuItem value="Alumni">Alumni</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    className={"my-2"}
                    fullWidth
                    label="Author Name"
                    variant="outlined"
                    value={addPost.authorName}
                    name="authorName"
                    onChange={(e) => handleChange(e)}
                    required
                    size="small"
                  />
                  <TextField
                    className={"my-2"}
                    fullWidth
                    label="Image link (https)"
                    variant="outlined"
                    value={addPost.cover}
                    name="cover"
                    onChange={(e) => handleChange(e)}
                    required
                    size="small"
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    color="error"
                    sx={{ width: "auto" }}
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button color="success" sx={{ width: "auto" }} type="submit">
                    Confirm
                  </Button>
                </DialogActions>
              </form>
            </Dialog>
            <a
              className="nav-link dropdown-toggle"
              href="/"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <Avatar sx={{ bgcolor: deepOrange[500] }}>
                {localStorage.getItem("name") &&
                  localStorage.getItem("name").slice(0, 1).toUpperCase()}
              </Avatar>
            </a>
            <ul className="dropdown-menu">
              <li>
                <Link className="dropdown-item">{user.username}</Link>
              </li>
              <li>
                <Link className="dropdown-item">{user.email}</Link>
              </li>
              <li>
                <Link className="dropdown-item">{user.role}</Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              {user && user.role === "Administrator" && (
                <>
                  <li>
                    <Link
                      className="dropdown-item"
                      onClick={() => setShow(true)}
                    >
                      Manage Login Accounts
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                </>
              )}
              <li>
                <Link
                  className="dropdown-item"
                  style={{ color: "red" }}
                  onClick={() => handleLogout()}
                >
                  Log Out
                </Link>
              </li>
            </ul>
          </Toolbar>
          <Toolbar
            component="nav"
            variant="dense"
            sx={{ justifyContent: "space-between", overflowX: "auto" }}
          >
            {sections.map((section) => (
              <Link
                key={section.url}
                to={`/${section.url}`}
                style={{ color: "black" }}
              >
                {section.title}
              </Link>
            ))}
          </Toolbar>
        </>
      )}
      {show && (
        <Dialog open={show} onClose={() => setShow(false)} fullWidth>
          <DialogTitle>Manage Login Accounts</DialogTitle>
          <DialogContent>
            {users &&
              users.length > 0 &&
              users
                .filter((user) => user.role !== "Administrator")
                .map((user) => (
                  <Box
                    key={user._id}
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>{user.username}</Typography>
                    <Switch
                      // defaultChecked={user.enable ? true : false}
                      // onChange={() =>
                      //   user.enable
                      //     ? disableUser(user._id)
                      //     : enableUser(user._id)
                      // }
                      defaultChecked={user.enable ? true : false}
                      onChange={() =>
                        handleEnableDisableUser(user._id, !user.enable)
                      }
                    />
                  </Box>
                ))}
          </DialogContent>
          <DialogActions>
            <Button
              color="error"
              sx={{ width: "auto" }}
              onClick={() => setShow(false)}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export default Header;
