const uploadController = {
  // POST /upload
  uploadFile: async (req, res) => {
    try {
      res.send("UPLOaded Successfully");
    } catch (error) {
      console.error("Error in uploadFile:", error);
      res.status(500).send("Internal Server Error");
    }
  },
};

module.exports = uploadController;
