import { useState } from "react";
import type { Speaker } from "../types/Speaker";
import { Upload, ALargeSmall } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
const SpeakerForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Speaker>({
    name: "",
    profile: "",
    bio: "",
  });
  const [image, setImage] = useState<string>("");
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setImage(previewUrl);
    }
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image || !formData.name || !formData.bio) {
      alert("all fields required");
      return;
    }
    setTimeout(() => {
      alert("Speaker created successfully");
      navigate("/organizer/Speakers");
    }, 1500);
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <form
          action=""
          onSubmit ={handleSubmit}
          className="max-w-none my-10 mx-5 px-4 pb-8 pt-4 border-gray-200 rounded-lg shadow-sm space-y-8 md:w-[700px] lg:w-[900px]"
        >
          {/*Upload profile picture for speaker here */}
          <div className="w-full h-64 rounder-lg overflow-hidden bg-gray-50 flex items-center justify-center relative">
            {image ? (
              <img
                src={image}
                alt="Speaker Profile picture"
                className="w-full h-full object-cover"
              />
            ) : (
              <label className="flex flex-col items-center justify-center cursor-pointer text-gray-500">
                <Upload size={32} />
                <span className="mt-2 text-sm">
                  Click to upload speaker profile picture
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
          {/* speaker name */}
          <div>
            <div className="flex items-center gap-2">
              <ALargeSmall size={18} />
              <input
                type="text"
                name="name"
                placeholder="Speaker name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-orange-400 focus:border-orange-400"
                required
              />
            </div>
          </div>
          {/* Speaker bio */}
          <div>
            <textarea
              placeholder="Speaker Biography"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-orange-400 focus:border-orange-400"
            />
          </div>
          <div>
            <button
              type="submit"
              className={cn(
                "h-10 w-full rounded-lg py-2 px-4 font-medium transition duration-300 ease-in-out",
                "inline-flex items-center justify-center gap-2",
                "bg-orange-500 text-white hover:bg-orange-600",
                "disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
              )}
            >Create Speaker</button>
          </div>
        </form>
      </div>
    </>
  );
};
export default SpeakerForm;
