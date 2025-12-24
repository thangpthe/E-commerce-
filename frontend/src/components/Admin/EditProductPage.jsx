// /* eslint-disable react-hooks/set-state-in-effect */
// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, useParams } from 'react-router-dom';
// import { fetchProductDetails, updateProduct } from '../../redux/slices/productsSlice';
// import axios from 'axios';

// const EditProductPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const {id} = useParams();
//   const {selectedProduct,loading,error} = useSelector((state) => state.products);
//   const [productData,setProductData] = useState({
//     name: "",
//     description: "",
//     price : 0,
//     countInStock: 0,
//     sku:"",
//     category: "",
//     brand: "",
//     sizes: [],
//     colors: [],
//     collections: "",
//     material:"",
//     gender: "",
//     images: []
//   });

//   // eslint-disable-next-line no-unused-vars
//   const [uploading,setUploading] = useState(false);
//   useEffect(()=> {
//     if(id){
//       dispatch(fetchProductDetails(id));
//     }

//   },[dispatch,id]);

//    useEffect(()=> {
//     if(selectedProduct){
//       setProductData(selectedProduct);
//     }
//   },[selectedProduct]);

//   const handleChange = (e) => {
//     const {name,value} = e.target;
//     setProductData((prevData) => ({...prevData,[name] : value}));
//   }

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     const formData = new FormData();
//     formData.append("image",file);
//     try {
//       setUploading(true);
//       const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload`,
//         formData,
//         {
//           headers: {"Content-Type": "multipart/form-data"},
//         }
//       );
//       setProductData((prevData) => ({
//         ...prevData,
//         images: [...prevData.images,{url: data.imageUrl,altText: ""}],
//       }));
//       setUploading(false);
//     } catch (error) {
//       console.error(error);
//       setUploading(false);
//     }
//   };

//   const handleDeleteImage = (index) => {
//     const updatedImages = productData.images.filter((_, i) => i !== index);
//     setProductData((prevData) => ({
//       ...prevData,
//       images: updatedImages,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     dispatch(updateProduct({id,productData}));
//     navigate("/admin/products");
//   }

//   if(loading) return <p>Loading...</p>
//   if(error) return <p>Error...</p>

//   return (
//     <div className='max-w-5xl mx-auto p-6 shadow-md rounded-md'>
//       <h2 className="text-3xl font-bold">Edit Product</h2>
//       <form action="" onSubmit={handleSubmit}>
//         <div className="mb-6">
//           <label htmlFor="" className='block font-semibold mb-2'>Product Name</label>
//           <input type="text" name="name" id="" value={productData.name} onChange={handleChange} className='w-full border border-gray-300 rounded-md p-2' required/>
//         </div>

//         <div className="mb-6">
//           <label htmlFor="" className='block font-semibold mb-2'>Description</label>
//           <textarea name="description" id="" value={productData.description} onChange={handleChange} className='w-full border border-gray-300 rounded-md p-2' rows={4} required/>
//         </div>

//         <div className="mb-6">
//           <label htmlFor="" className='block font-semibold mb-2'>Price</label>
//           <input type="number" name="price" id="" value={productData.price} onChange={handleChange} className='w-full border border-gray-300 rounded-md p-2' required/>
//         </div>

//         <div className="mb-6">
//           <label htmlFor="" className='block font-semibold mb-2'>Count in Stock</label>
//           <input type="number" name="countInStock" id="" value={productData.countInStock} onChange={handleChange} className='w-full border border-gray-300 rounded-md p-2' required/>
//         </div>

//         <div className="mb-6">
//           <label htmlFor="" className='block font-semibold mb-2'>SKU</label>
//           <input type="text" name="sku" id="" value={productData.sku} onChange={handleChange} className='w-full border border-gray-300 rounded-md p-2' required/>
//         </div>

//         <div className="mb-6">
//           <label htmlFor="" className='block font-semibold mb-2'>Sizes (comma-seperated)</label>
//           <input type="text" name="sizes" id="" value={productData.sizes.join(",")} onChange={(e) => setProductData({...productData,sizes: e.target.value.split(",").map((size)=> size.trim())

//           })} className='w-full border border-gray-300 rounded-md p-2' required/>

//         </div>

//         <div className="mb-6">
//           <label htmlFor="" className='block font-semibold mb-2'>Colors (comma-seperated)</label>
//           <input type="text" name="colors" id="" value={productData.colors.join(",")} onChange={(e) => setProductData({...productData,colors: e.target.value.split(",").map((color)=> color.trim())

//           })} className='w-full border border-gray-300 rounded-md p-2' required/>
          
//         </div>

//         <div className="mb-6">
//           <label htmlFor="" className='block font-semibold mb-2'>Upload Image</label>
//           <input type="file" onChange={handleImageUpload}/>
//           {uploading && <p>Uploading</p>}
//           {/* <div className="flex gap-4 mt-4">
//             {productData.images.map((image,index)=> (
//               <div key={index}>
//                 <img src={image.url} alt={image.altText || "Product"} className='w-20 h-20 object-cover rounded-md shadow-md '/>
//               </div>
//             ))}
//           </div> */}
//           <div className="flex gap-4 mt-4">
//             {productData.images.map((image, index) => (
//               <div key={index} className="relative group">
//                 <img
//                   src={image.url}
//                   alt={image.altText || "Product"}
//                   className="w-20 h-20 object-cover rounded-md shadow-md"
//                 />
                
//                 <button
//                   type="button" 
//                   onClick={() => handleDeleteImage(index)}
//                   className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
//                 >
//                   ✕
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         <button type='submit' className='w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors'>Update Product</button>
//       </form>
//     </div>
//   )
// }

// export default EditProductPage;

// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, useParams } from 'react-router-dom';
// import { fetchProductDetails, updateProduct } from '../../redux/slices/productsSlice';
// import axios from 'axios';

// const EditProductPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const {id} = useParams();
//   const {selectedProduct, loading, error} = useSelector((state) => state.products);
  
//   const [productData, setProductData] = useState({
//     name: "",
//     description: "",
//     price: 0,
//     discountPrice: 0,
//     countInStock: 0,
//     sku: "",
//     category: "",
//     brand: "",
//     sizes: [],
//     colors: [],
//     collections: "",
//     material: "",
//     gender: "",
//     images: [],
//     isFeatured: false,
//     isPublished: true,
//   });

//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     if (id) {
//       dispatch(fetchProductDetails(id));
//     }
//   }, [dispatch, id]);

//   useEffect(() => {
//     if (selectedProduct) {
//       // eslint-disable-next-line react-hooks/set-state-in-effect
//       setProductData({
//         name: selectedProduct.name || "",
//         description: selectedProduct.description || "",
//         price: selectedProduct.price || 0,
//         discountPrice: selectedProduct.discountPrice || 0,
//         countInStock: selectedProduct.countInStock || 0,
//         sku: selectedProduct.sku || "",
//         category: selectedProduct.category || "",
//         brand: selectedProduct.brand || "",
//         sizes: selectedProduct.sizes || [],
//         colors: selectedProduct.colors || [],
//         collections: selectedProduct.collections || "",
//         material: selectedProduct.material || "",
//         gender: selectedProduct.gender || "",
//         images: selectedProduct.images || [],
//         isFeatured: selectedProduct.isFeatured || false,
//         isPublished: selectedProduct.isPublished !== undefined ? selectedProduct.isPublished : true,
//       });
//     }
//   }, [selectedProduct]);

//   const handleChange = (e) => {
//     const {name, value, type, checked} = e.target;
//     setProductData((prevData) => ({
//       ...prevData,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("image", file);
    
//     try {
//       setUploading(true);
//       const {data} = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
//         formData,
//         {
//           headers: {"Content-Type": "multipart/form-data"},
//         }
//       );
      
//       setProductData((prevData) => ({
//         ...prevData,
//         images: [...prevData.images, {url: data.imageUrl, altText: file.name}],
//       }));
      
//       console.log("✅ Image uploaded:", data.imageUrl);
//       setUploading(false);
//     } catch (error) {
//       console.error("❌ Upload error:", error);
//       alert("Failed to upload image");
//       setUploading(false);
//     }
//   };

//   const handleDeleteImage = (index) => {
//     const updatedImages = productData.images.filter((_, i) => i !== index);
//     setProductData((prevData) => ({
//       ...prevData,
//       images: updatedImages,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     console.log("Submitting product data:", productData);
//     console.log("Images count:", productData.images.length);
    
//     try {
//       await dispatch(updateProduct({id, productData})).unwrap();
//       alert("Product updated successfully!");
//       navigate("/admin/products");
//     } catch (error) {
//       console.error("Update error:", error);
//       alert("Failed to update product: " + (error.message || "Unknown error"));
//     }
//   };

//   if (loading) return (
//     <div className="max-w-5xl mx-auto p-6 text-center">
//       <p>Loading product...</p>
//     </div>
//   );
  
//   if (error) return (
//     <div className="max-w-5xl mx-auto p-6 text-center">
//       <p className="text-red-500">Error: {error}</p>
//     </div>
//   );

//   return (
//     <div className='max-w-5xl mx-auto p-6 shadow-md rounded-md bg-white'>
//       <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
      
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Product Name */}
//         <div>
//           <label htmlFor="name" className='block font-semibold mb-2'>Product Name *</label>
//           <input 
//             type="text" 
//             name="name" 
//             id="name"
//             value={productData.name} 
//             onChange={handleChange} 
//             className='w-full border border-gray-300 rounded-md p-2' 
//             required
//           />
//         </div>

//         {/* Description */}
//         <div>
//           <label htmlFor="description" className='block font-semibold mb-2'>Description *</label>
//           <textarea 
//             name="description" 
//             id="description"
//             value={productData.description} 
//             onChange={handleChange} 
//             className='w-full border border-gray-300 rounded-md p-2' 
//             rows={4} 
//             required
//           />
//         </div>

//         {/* Price & Discount */}
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label htmlFor="price" className='block font-semibold mb-2'>Price *</label>
//             <input 
//               type="number" 
//               name="price" 
//               id="price"
//               value={productData.price} 
//               onChange={handleChange} 
//               className='w-full border border-gray-300 rounded-md p-2' 
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="discountPrice" className='block font-semibold mb-2'>Discount Price</label>
//             <input 
//               type="number" 
//               name="discountPrice" 
//               id="discountPrice"
//               value={productData.discountPrice} 
//               onChange={handleChange} 
//               className='w-full border border-gray-300 rounded-md p-2'
//             />
//           </div>
//         </div>

//         {/* Stock & SKU */}
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label htmlFor="countInStock" className='block font-semibold mb-2'>Count in Stock *</label>
//             <input 
//               type="number" 
//               name="countInStock" 
//               id="countInStock"
//               value={productData.countInStock} 
//               onChange={handleChange} 
//               className='w-full border border-gray-300 rounded-md p-2' 
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="sku" className='block font-semibold mb-2'>SKU *</label>
//             <input 
//               type="text" 
//               name="sku" 
//               id="sku"
//               value={productData.sku} 
//               onChange={handleChange} 
//               className='w-full border border-gray-300 rounded-md p-2' 
//               required
//             />
//           </div>
//         </div>

//         {/* Category & Brand */}
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label htmlFor="category" className='block font-semibold mb-2'>Category *</label>
//             <input 
//               type="text" 
//               name="category" 
//               id="category"
//               value={productData.category} 
//               onChange={handleChange} 
//               className='w-full border border-gray-300 rounded-md p-2' 
//               placeholder="e.g., Top Wear, Bottom Wear"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="brand" className='block font-semibold mb-2'>Brand</label>
//             <input 
//               type="text" 
//               name="brand" 
//               id="brand"
//               value={productData.brand} 
//               onChange={handleChange} 
//               className='w-full border border-gray-300 rounded-md p-2'
//             />
//           </div>
//         </div>

//         {/* Gender & Collection */}
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label htmlFor="gender" className='block font-semibold mb-2'>Gender *</label>
//             <select 
//               name="gender" 
//               id="gender"
//               value={productData.gender} 
//               onChange={handleChange} 
//               className='w-full border border-gray-300 rounded-md p-2'
//               required
//             >
//               <option value="">Select Gender</option>
//               <option value="Men">Men</option>
//               <option value="Women">Women</option>
//               <option value="Unisex">Unisex</option>
//             </select>
//           </div>
//           <div>
//             <label htmlFor="collections" className='block font-semibold mb-2'>Collection</label>
//             <input 
//               type="text" 
//               name="collections" 
//               id="collections"
//               value={productData.collections} 
//               onChange={handleChange} 
//               className='w-full border border-gray-300 rounded-md p-2'
//               placeholder="e.g., Summer, Winter"
//             />
//           </div>
//         </div>

//         {/* Material */}
//         <div>
//           <label htmlFor="material" className='block font-semibold mb-2'>Material</label>
//           <input 
//             type="text" 
//             name="material" 
//             id="material"
//             value={productData.material} 
//             onChange={handleChange} 
//             className='w-full border border-gray-300 rounded-md p-2'
//             placeholder="e.g., Cotton, Polyester"
//           />
//         </div>

//         {/* Sizes */}
//         <div>
//           <label htmlFor="sizes" className='block font-semibold mb-2'>Sizes (comma-separated) *</label>
//           <input 
//             type="text" 
//             name="sizes" 
//             id="sizes"
//             value={productData.sizes.join(",")} 
//             onChange={(e) => setProductData({
//               ...productData,
//               sizes: e.target.value.split(",").map((size) => size.trim()).filter(Boolean)
//             })} 
//             className='w-full border border-gray-300 rounded-md p-2' 
//             placeholder="e.g., S, M, L, XL"
//             required
//           />
//         </div>

//         {/* Colors */}
//         <div>
//           <label htmlFor="colors" className='block font-semibold mb-2'>Colors (comma-separated) *</label>
//           <input 
//             type="text" 
//             name="colors" 
//             id="colors"
//             value={productData.colors.join(",")} 
//             onChange={(e) => setProductData({
//               ...productData,
//               colors: e.target.value.split(",").map((color) => color.trim()).filter(Boolean)
//             })} 
//             className='w-full border border-gray-300 rounded-md p-2' 
//             placeholder="e.g., Red, Blue, Green"
//             required
//           />
//         </div>

//         {/* Images */}
//         <div>
//           <label htmlFor="imageUpload" className='block font-semibold mb-2'>Product Images</label>
//           <input 
//             type="file" 
//             id="imageUpload"
//             onChange={handleImageUpload}
//             accept="image/*"
//             className="mb-2"
//           />
//           {uploading && <p className="text-blue-500">Uploading image...</p>}
          
//           <div className="flex flex-wrap gap-4 mt-4">
//             {productData.images.map((image, index) => (
//               <div key={index} className="relative group">
//                 <img
//                   src={image.url}
//                   alt={image.altText || "Product"}
//                   className="w-24 h-24 object-cover rounded-md shadow-md"
//                 />
//                 <button
//                   type="button" 
//                   onClick={() => handleDeleteImage(index)}
//                   className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition"
//                 >
//                   ✕
//                 </button>
//               </div>
//             ))}
//           </div>
//           {productData.images.length === 0 && (
//             <p className="text-gray-500 text-sm mt-2">No images uploaded yet</p>
//           )}
//         </div>

//         {/* Checkboxes */}
//         <div className="flex gap-6">
//           <label className="flex items-center">
//             <input 
//               type="checkbox" 
//               name="isFeatured" 
//               checked={productData.isFeatured} 
//               onChange={handleChange}
//               className="mr-2"
//             />
//             <span className="font-semibold">Featured Product</span>
//           </label>
          
//           <label className="flex items-center">
//             <input 
//               type="checkbox" 
//               name="isPublished" 
//               checked={productData.isPublished} 
//               onChange={handleChange}
//               className="mr-2"
//             />
//             <span className="font-semibold">Published</span>
//           </label>
//         </div>

//         {/* Submit Button */}
//         <button 
//           type='submit' 
//           disabled={uploading}
//           className='w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold'
//         >
//           {uploading ? 'Uploading Image...' : 'Update Product'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditProductPage;


import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProductDetails, updateProduct } from '../../redux/slices/productsSlice';
import axios from 'axios';

const EditProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {id} = useParams();
  const {selectedProduct, loading, error} = useSelector((state) => state.products);
  
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    discountPrice: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    material: "",
    gender: "",
    images: [],
    isFeatured: false,
    isPublished: true,
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProductData({
        name: selectedProduct.name || "",
        description: selectedProduct.description || "",
        price: selectedProduct.price || 0,
        discountPrice: selectedProduct.discountPrice || 0,
        countInStock: selectedProduct.countInStock || 0,
        sku: selectedProduct.sku || "",
        category: selectedProduct.category || "",
        brand: selectedProduct.brand || "",
        sizes: selectedProduct.sizes || [],
        colors: selectedProduct.colors || [],
        collections: selectedProduct.collections || "",
        material: selectedProduct.material || "",
        gender: selectedProduct.gender || "",
        images: selectedProduct.images || [],
        isFeatured: selectedProduct.isFeatured || false,
        isPublished: selectedProduct.isPublished !== undefined ? selectedProduct.isPublished : true,
      });
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const {name, value, type, checked} = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    
    try {
      setUploading(true);
      console.log("📤 Uploading image...");
      
      const {data} = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        {
          headers: {"Content-Type": "multipart/form-data"},
        }
      );
      
      console.log("✅ Image uploaded:", data.imageUrl);
      
      setProductData((prevData) => {
        const newImages = [...prevData.images, {url: data.imageUrl, altText: file.name}];
        console.log("📸 Updated images array:", newImages);
        return {
          ...prevData,
          images: newImages,
        };
      });
      
      setUploading(false);
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("❌ Upload error:", error);
      alert("Failed to upload image: " + (error.response?.data?.message || error.message));
      setUploading(false);
    }
  };

  const handleDeleteImage = (index) => {
    console.log("🗑️ Deleting image at index:", index);
    
    setProductData((prevData) => {
      const updatedImages = prevData.images.filter((_, i) => i !== index);
      console.log("📸 Images after deletion:", updatedImages);
      return {
        ...prevData,
        images: updatedImages,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("=== SUBMITTING PRODUCT UPDATE ===");
    console.log("Product ID:", id);
    console.log("Product Data:", productData);
    console.log("Images count:", productData.images.length);
    console.log("Images array:", productData.images);
    
    try {
      const result = await dispatch(updateProduct({id, productData})).unwrap();
      console.log("✅ Update successful:", result);
      alert("Product updated successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.error("❌ Update error:", error);
      alert("Failed to update product: " + (error.message || "Unknown error"));
    }
  };

  if (loading) return (
    <div className="max-w-5xl mx-auto p-6 text-center">
      <p>Loading product...</p>
    </div>
  );
  
  if (error) return (
    <div className="max-w-5xl mx-auto p-6 text-center">
      <p className="text-red-500">Error: {error}</p>
    </div>
  );

  return (
    <div className='max-w-5xl mx-auto p-6 shadow-md rounded-md bg-white'>
      <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label htmlFor="name" className='block font-semibold mb-2'>Product Name *</label>
          <input 
            type="text" 
            name="name" 
            id="name"
            value={productData.name} 
            onChange={handleChange} 
            className='w-full border border-gray-300 rounded-md p-2' 
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className='block font-semibold mb-2'>Description *</label>
          <textarea 
            name="description" 
            id="description"
            value={productData.description} 
            onChange={handleChange} 
            className='w-full border border-gray-300 rounded-md p-2' 
            rows={4} 
            required
          />
        </div>

        {/* Price & Discount */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className='block font-semibold mb-2'>Price *</label>
            <input 
              type="number" 
              name="price" 
              id="price"
              value={productData.price} 
              onChange={handleChange} 
              className='w-full border border-gray-300 rounded-md p-2' 
              required
            />
          </div>
          <div>
            <label htmlFor="discountPrice" className='block font-semibold mb-2'>Discount Price</label>
            <input 
              type="number" 
              name="discountPrice" 
              id="discountPrice"
              value={productData.discountPrice} 
              onChange={handleChange} 
              className='w-full border border-gray-300 rounded-md p-2'
            />
          </div>
        </div>

        {/* Stock & SKU */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="countInStock" className='block font-semibold mb-2'>Count in Stock *</label>
            <input 
              type="number" 
              name="countInStock" 
              id="countInStock"
              value={productData.countInStock} 
              onChange={handleChange} 
              className='w-full border border-gray-300 rounded-md p-2' 
              required
            />
          </div>
          <div>
            <label htmlFor="sku" className='block font-semibold mb-2'>SKU *</label>
            <input 
              type="text" 
              name="sku" 
              id="sku"
              value={productData.sku} 
              onChange={handleChange} 
              className='w-full border border-gray-300 rounded-md p-2' 
              required
            />
          </div>
        </div>

        {/* Category & Brand */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className='block font-semibold mb-2'>Category *</label>
            <input 
              type="text" 
              name="category" 
              id="category"
              value={productData.category} 
              onChange={handleChange} 
              className='w-full border border-gray-300 rounded-md p-2' 
              placeholder="e.g., Top Wear, Bottom Wear"
              required
            />
          </div>
          <div>
            <label htmlFor="brand" className='block font-semibold mb-2'>Brand</label>
            <input 
              type="text" 
              name="brand" 
              id="brand"
              value={productData.brand} 
              onChange={handleChange} 
              className='w-full border border-gray-300 rounded-md p-2'
            />
          </div>
        </div>

        {/* Gender & Collection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="gender" className='block font-semibold mb-2'>Gender *</label>
            <select 
              name="gender" 
              id="gender"
              value={productData.gender} 
              onChange={handleChange} 
              className='w-full border border-gray-300 rounded-md p-2'
              required
            >
              <option value="">Select Gender</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>
          <div>
            <label htmlFor="collections" className='block font-semibold mb-2'>Collection</label>
            <input 
              type="text" 
              name="collections" 
              id="collections"
              value={productData.collections} 
              onChange={handleChange} 
              className='w-full border border-gray-300 rounded-md p-2'
              placeholder="e.g., Summer, Winter"
            />
          </div>
        </div>

        {/* Material */}
        <div>
          <label htmlFor="material" className='block font-semibold mb-2'>Material</label>
          <input 
            type="text" 
            name="material" 
            id="material"
            value={productData.material} 
            onChange={handleChange} 
            className='w-full border border-gray-300 rounded-md p-2'
            placeholder="e.g., Cotton, Polyester"
          />
        </div>

        {/* Sizes */}
        <div>
          <label htmlFor="sizes" className='block font-semibold mb-2'>Sizes (comma-separated) *</label>
          <input 
            type="text" 
            name="sizes" 
            id="sizes"
            value={productData.sizes.join(",")} 
            onChange={(e) => setProductData({
              ...productData,
              sizes: e.target.value.split(",").map((size) => size.trim()).filter(Boolean)
            })} 
            className='w-full border border-gray-300 rounded-md p-2' 
            placeholder="e.g., S, M, L, XL"
            required
          />
        </div>

        {/* Colors */}
        <div>
          <label htmlFor="colors" className='block font-semibold mb-2'>Colors (comma-separated) *</label>
          <input 
            type="text" 
            name="colors" 
            id="colors"
            value={productData.colors.join(",")} 
            onChange={(e) => setProductData({
              ...productData,
              colors: e.target.value.split(",").map((color) => color.trim()).filter(Boolean)
            })} 
            className='w-full border border-gray-300 rounded-md p-2' 
            placeholder="e.g., Red, Blue, Green"
            required
          />
        </div>

        {/* Images */}
        <div>
          <label htmlFor="imageUpload" className='block font-semibold mb-2'>Product Images</label>
          <input 
            type="file" 
            id="imageUpload"
            onChange={handleImageUpload}
            accept="image/*"
            className="mb-2"
          />
          {uploading && <p className="text-blue-500">Uploading image...</p>}
          
          <div className="flex flex-wrap gap-4 mt-4">
            {productData.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.url}
                  alt={image.altText || "Product"}
                  className="w-24 h-24 object-cover rounded-md shadow-md"
                />
                <button
                  type="button" 
                  onClick={() => handleDeleteImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          {productData.images.length === 0 && (
            <p className="text-gray-500 text-sm mt-2">No images uploaded yet</p>
          )}
        </div>

        {/* Checkboxes */}
        <div className="flex gap-6">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              name="isFeatured" 
              checked={productData.isFeatured} 
              onChange={handleChange}
              className="mr-2"
            />
            <span className="font-semibold">Featured Product</span>
          </label>
          
          <label className="flex items-center">
            <input 
              type="checkbox" 
              name="isPublished" 
              checked={productData.isPublished} 
              onChange={handleChange}
              className="mr-2"
            />
            <span className="font-semibold">Published</span>
          </label>
        </div>

        {/* Submit Button */}
        <button 
          type='submit' 
          disabled={uploading}
          className='w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold'
        >
          {uploading ? 'Uploading Image...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;