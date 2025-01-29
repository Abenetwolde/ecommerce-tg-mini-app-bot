import uploadImageClodinary from "../utils/uploadImageClodinary.js"

const uploadImageController = async(request,response)=>{
    try {
        const file = request.file
console.log("let see the file.........",file)
        const uploadImage = await uploadImageClodinary(file)

        return response.json({
            message : "Upload done",
            data : uploadImage,
            success : true,
            error : false
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}
const MultipleuploadImageController = async (request, response) => {
    try {
      const files = request.files;
      console.log("let see the files.........",files)
      if (!files || files.length === 0) {
        return response.status(400).json({
          message: "No files uploaded",
          error: true,
          success: false,
        });
      }
  
      const uploadPromises = files.map(file => uploadImageClodinary(file));
      const uploadResults = await Promise.all(uploadPromises);
  
      return response.json({
        message: "Upload done",
        data: uploadResults,
        success: true,
        error: false,
      });
    } catch (error) {
      return response.status(500).json({
        message: error.message || error,
        error: true,
        success: false,
      });
    }
  };

export {uploadImageController,MultipleuploadImageController}