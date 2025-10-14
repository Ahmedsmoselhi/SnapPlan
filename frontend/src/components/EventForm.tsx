import React, { useState, useEffect } from "react";
import { Calendar, LoaderCircle, MapPin, Upload } from "lucide-react";
// import type { Ticket } from "../types/Ticket";
import type { Event } from "../types/Event";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";

import { eventsDummy } from "../data/events";
import type { Venue } from "../types/Venue";

const EventForm = () => {
  // const [image, setImage] = useState<string>("");
  // const [title, setTitle] = useState("");
  // const [startDate, setStartDate] = useState("");
  // const [endDate, setEndDate] = useState("");
  // const [venue, setVenue] = useState("");
  // const [selectedTickets, setSelectedTickets] = useState<Ticket["type"][]>([]);
  // const [description, setDescription] = useState("");
  const [venues, setVenues] = useState<Venue[]>([]);
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const mappedVenues = eventsDummy.map((event) => event.venue);
        console.log("Mapped Venues:", mappedVenues);
        setVenues(mappedVenues);
      } catch (error) {
        console.error("Failed to fetch venues:", error);
      }
    };

    fetchVenues();
  }, []);

  console.log(eventsDummy.map((event) => event.venue));
  const [formData, setFormData] = useState<Event>({
    title: "",
    startDate: "",
    endDate: "",
    venue: { name: "", address: "", location: "", rooms: [] },
    description: "",
  });

  const [image, setImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // image handling

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setImage(previewUrl);
    }
  };

  //api service function

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "venues") {
      if(value==="Add"){
        navigate("/organizer/CreateVenue");
        return;
      }
      const selectedVenue = venues.find((venue) => venue.name === value);
      if (selectedVenue) {
        setFormData((prev) => ({
          ...prev,
          venue: selectedVenue,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (
      !image ||
      !formData.title ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.venue ||
      !formData.description
    ) {
      alert("all fields required");
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert("Event created successfully!");
      navigate("/organizer/MyEvents");
    }, 1500);
  };
  const handleDraft = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(()=>{
      setLoading(false);
      alert("Event saved as draft!");
      navigate("/organizer/DraftEvents");
    })
  }
  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="max-w-none my-10 mx-5 px-4 pb-8 pt-4 border border-gray-200 rounded-lg shadow-sm space-y-8 md:w-[700px] lg:w-[900px]"
      >
        {/* Image Upload */}
        <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center relative">
          {image ? (
            <img
              src={image}
              alt="Event preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <label className="flex flex-col items-center justify-center cursor-pointer text-gray-500">
              <Upload size={32} />
              <span className="mt-2 text-sm">Click to upload event image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>

        {/* Title */}
        <div>
          <input
            type="text"
            name="title"
            placeholder="Event title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-lg font-bold focus:ring-orange-400 focus:border-orange-400"
            required
          />
        </div>

        {/* Date Range */}
        <div className="flex flex-wrap gap-6 text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-orange-400 focus:border-orange-400"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-orange-400 focus:border-orange-400"
              required
            />
          </div>
        </div>

        {/* Venue */}
        {/* <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={18} />
                    <input
                        type="text"
                        name="venueName"
                        placeholder="Event location"
                        value={formData.venueName}
                        onChange={handleChange}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-orange-400 focus:border-orange-400"
                        required
                    />
                </div> */}
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin size={18} />
          <select
            className="w-160 px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-400 focus:border-orange-400"
            name="venues"
            id=""
            value={formData.venue.name}
            onChange={handleChange}
            required
          >
            <option value="">Select Venue</option>
            {venues &&
              venues.map((venue, index) => {
                return (
                  <option value={venue.name} key={index}>
                    {venue.name} - {venue.location}
                  </option>
                );
              })}
            <option value="Add">Add New Venue</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <textarea
            placeholder="Event description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-orange-400 focus:border-orange-400"
          />
        </div>
        {/* Save as Draft Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className={cn(
              "h-10 w-full rounded-lg py-2 px-4 font-medium transition duration-300 ease-in-out",
              "inline-flex items-center justify-center gap-2",
              "bg-blue-500 text-white hover:bg-blue-600",
              "disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
            )}
            onClick = {handleDraft}
          >
            Save as Draft
          </button>
        </div>
        {/* Submit */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className={cn(
              "h-10 w-full rounded-lg py-2 px-4 font-medium transition duration-300 ease-in-out",
              "inline-flex items-center justify-center gap-2",
              "bg-orange-500 text-white hover:bg-orange-600",
              "disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
            )
            
          }
          >
            {loading ? (
              <LoaderCircle
                className="animate-spin"
                color={loading ? "#9CA3AF" : "#fff"}
              />
            ) : (
              "Create Event"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
