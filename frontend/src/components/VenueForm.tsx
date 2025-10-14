import React, { useState } from "react";
import type { Venue } from "../types/Venue";
import { CaseLower, DoorClosed, BookUser, MapPin } from "lucide-react";
import type { Room } from "../types/Room";
import { cn } from "../lib/utils";
import {useNavigate} from "react-router-dom";

export default function CreateVenueForm() {
  const [formData, setFormData] = useState<Venue>({
    name: "",
    address: "",
    location: "",
    rooms: [],
  });
  const [rooms, setRooms] = useState<Room[]>([]);
  const navigate = useNavigate();
  const [roomCount, setRoomCount] = useState(1);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const roomNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setRoomCount(value);
    const newRooms: Room[] = Array.from({ length: value }, (_, index) => ({
      id: index++,
      name: "",
      capacity: 1,
    }));
    setRooms(newRooms);
  };
  const handleRoomChange = (
    index: number,
    field: "name" | "capacity",
    value: string | number
  ) => {
    const updatedRooms = [...rooms];
    updatedRooms[index] = { ...updatedRooms[index], [field]: value };
    setRooms(updatedRooms);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.location || rooms.length === 0) {
      alert("all fields required");
      return;
    }
    console.log("Venue created:", { ...formData, rooms });
    setTimeout(() => {
      alert("Venue created successfully!");
      navigate("/organizer/CreateEvent");
    }, 1500);
  }
  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <form
          action=""
          onSubmit={handleSubmit}
          className="max-w-none my-10 mx-5 px-4 pb-8 pt-4 border border-gray-200 rounded-lg shadow-sm space-y-8 md:w-[700px] lg:w-[900px]"
        >
          {/* Name */}
          <div className="flex items-center gap-2">
            <CaseLower size={18} />
            <input
              type="text"
              name="name"
              placeholder="Venue Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-lg font-bold focus:ring-orange-400 "
              required
            />
          </div>
          {/* Address */}
          <div className="flex items-center gap-2">
            <BookUser size={18} />
            <input
              type="text"
              name="address"
              placeholder="Venue Address"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-lg font-bold focus:ring-orange-400 "
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          {/* Location */}
          <div className="flex items-center gap-2">
            <MapPin size={18} />
            <input
              type="text"
              name="location"
              placeholder="Venue Location"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-lg font-bold focus:ring-orange-400 "
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          {/* Rooms */}

          <div className="flex items-center gap-2">
            <DoorClosed size={18} />
            <input
              type="number"
              name="noofrooms"
              id=""
              min="1"
              max="100000"
              value={roomCount}
              onChange={roomNoChange}
              placeholder="# of rooms"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-400 focus:border-orange-400
             [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          {/* Rooms display */}
          <div className="flex flex-wrap w-full gap-2">
            {rooms.map((room, index) => {
              return (
                <div
                  className="p-4 border rounded-xl shadow-sm bg-gray-50 space-y-2"
                  key={index}
                >
                  <h4>Enter Room details</h4>
                  <form
                    action=""
                    className="flex flex-row flex-wrap gap-2 w-60 "
                  >
                    <input
                      type="text"
                      name=""
                      id=""
                      placeholder="Room Name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-400 focus:border-orange-400"
                      value={room.name}
                      onChange={(e) =>
                        handleRoomChange(index, "name", e.target.value)
                      }
                    />
                    <input
                      type="number"
                      name=""
                      id=""
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-400 focus:border-orange-400"
                      placeholder="Room Capacity"
                      value={room.capacity}
                      onChange={(e) =>
                        handleRoomChange(
                          index,
                          "capacity",
                          Number(e.target.value)
                        )
                      }
                    />
                  </form>
                </div>
              );
            })}
          </div>
          {/* buttons */}
          <div>
            <button
              type="submit"
              className={cn(
                "h-10 w-full rounded-lg py-2 px-4 font-medium transition duration-300 ease-in-out",
                "inline-flex items-center justify-center gap-2",
                "bg-orange-500 text-white hover:bg-orange-600",
                "disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
              )}
            >
              Create Venue
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
