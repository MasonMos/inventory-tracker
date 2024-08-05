"use client";

import {
  Box,
  TextField,
  Typography,
  Modal,
  Button,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import * as React from "react";
import { Stack } from "@mui/system";
import { useRef, useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  collection,
  doc,
  query,
  getDocs,
  getDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { Camera } from "react-camera-pro";
import { BiSolidCamera } from "react-icons/bi";
import { BsBoxes } from "react-icons/bs";
import { FaRegTrashAlt } from "react-icons/fa";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [openItem, setOpenItem] = useState(false);
  const [openPhoto, setOpenPhoto] = useState(false);
  const [itemName, setItemName] = useState("");
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [search, setSearch] = useState("");
  const camera = useRef(null);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image }),
      });
      if (!res.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await res.json();
      if (data.response === "???") {
        alert("Could not identify object in image.");
      } else {
        addItem(data.response);
        setItemName(data.response);
        updateInventory();
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  };

  const filterInventory = (query) => {
    const filteredList = inventory.filter((item) => {
      return item.name.toLowerCase().includes(query.toLowerCase());
    });
    setFilteredInventory(filteredList);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  useEffect(() => {
    filterInventory(search);
  }, [search, inventory]);

  useEffect(() => {
    if (image) {
      handleSubmit();
    }
  }, [image]);

  const handleOpenItem = () => setOpenItem(true);
  const handleCloseItem = () => setOpenItem(false);
  const handleOpenPhoto = () => setOpenPhoto(true);
  const handleClosePhoto = () => setOpenPhoto(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      paddingTop={4}
    >
      <Modal open={openItem} onClose={handleCloseItem}>
        <Box
          position={"absolute"}
          top="50%"
          left="50%"
          width="90%"
          maxWidth={400}
          bgcolor={"white"}
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display={"flex"}
          flexDirection={"column"}
          gap={3}
          sx={{
            transform: "translate(-50%,-50%)",
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleCloseItem();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box sx={{ width: "100%", px: 2 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              href="/"
            >
              <BsBoxes />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Inventory Tracker
            </Typography>
            <TextField
              variant="outlined"
              placeholder="Search inventory"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              size="small"
              sx={{
                marginRight: 2,
                backgroundColor: "white",
              }}
            />
            <Button
              variant="contained"
              onClick={handleOpenPhoto}
              sx={{ marginRight: 2 }}
            >
              Add New Item with Photo
            </Button>
            <Button variant="contained" onClick={handleOpenItem}>
              Add New Item
            </Button>
          </Toolbar>
        </AppBar>
      </Box>

      <Box width="100%" maxWidth={1500} padding={2}>
        <Stack width="100%" spacing={2} overflow={"auto"} marginTop={2}>
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              bgcolor={"#f0f0f0"}
              padding={3}
              borderRadius={"25px"}
              border={"1px solid #333"}
            >
              <Typography variant={"h5"} color={"#333"} textAlign={"center"}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>

              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                minWidth={80}
              >
                <Typography variant={"h5"} color={"#333"} textAlign={"center"}>
                  {quantity}
                </Typography>
              </Box>
              <IconButton
                size="medium"
                color="inherit"
                onClick={() => {
                  removeItem(name);
                }}
              >
                <FaRegTrashAlt />
              </IconButton>
            </Box>
          ))}
        </Stack>
      </Box>

      <Modal open={openPhoto} onClose={handleClosePhoto}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width="90%"
          maxWidth={600}
          height="90%"
          maxHeight={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%,-50%)",
          }}
        >
          <Camera
            ref={camera}
            onTakePhoto={(dataUri) => {
              setImage(dataUri);
            }}
          />
          <Box
            position="absolute"
            top="90%"
            left="50%"
            sx={{
              transform: "translate(-50%, -50%)",
            }}
          >
            <Button
              sx={{
                width: 64,
                height: 64,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "50%",
                border: "1px solid #000",
              }}
              onClick={() => {
                if (camera.current) {
                  setImage(camera.current.takePhoto());
                  handleClosePhoto();
                }
              }}
            >
              <BiSolidCamera size={40} />
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
