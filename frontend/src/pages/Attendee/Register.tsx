import { MailIcon, Phone, User, Briefcase, Globe, LoaderCircle } from 'lucide-react'
import { cn } from '../../lib/utils'
import Logo from '../../components/logo'
import { Link, useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import type { Organizer } from '../../types/Organizer'



const RegisterAttendee = () => {

    const [formData, setFormData] = useState<Organizer>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        organization: "",
        job: "",
        country: ""
    })

    const [loading, setLoading] = useState<boolean>(false)

    const navigate = useNavigate()

    // api service function

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        if (!formData.firstName || !formData.lastName ||
            !formData.email || !formData.phone ||
            !formData.organization || !formData.job ||
            !formData.country
        ) {
            alert('all fields required')
            setLoading(false)
            return
        }

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            alert('Registration successful!');
            navigate('/organizer/login')
        }, 1500);


    }


    return (
        <>
            <div className='flex min-h-screen items-center justify-center'>
                <div className='w-full max-w-md rounded-lg bg-gray-100 p-6'>
                    <h1 className='text-center mb-8'><Logo size="text-4xl" /></h1>
                    <h2 className='mb-8 text-center text-2xl font-semibold text-gray-800'>
                        Create Event Manager Account
                    </h2>

                    <form onSubmit={handleSubmit}>

                        {/* Row 1: First Name & Last Name */}

                        <div className="grid grid-cols-2 gap-x-4 mb-6">
                            <div>
                                <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-[#344054]">
                                    First Name <sup>*</sup>
                                </label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3 text-[#667085]"><User size={20} /></span>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name='firstName'
                                        placeholder='First Name'
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className={cn("w-full rounded-lg border border-[#D0D5DD]",
                                            "px-4 py-2.5 text-gray-700 placeholder:text-[#667085] pl-10",
                                            "focus:border-blue-200 focus:ring-2 focus:ring-blue-200 focus:outline-none")}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-[#344054]">
                                    Last Name <sup>*</sup>
                                </label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3 text-[#667085]"><User size={20} /></span>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name='lastName'
                                        placeholder='Last Name'
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className={cn("w-full rounded-lg border border-[#D0D5DD]",
                                            "px-4 py-2.5 text-gray-700 placeholder:text-[#667085] pl-10",
                                            "focus:border-blue-200 focus:ring-2 focus:ring-blue-200 focus:outline-none")}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Work Email & Phone Number */}

                        <div className="grid grid-cols-2 gap-x-4 mb-6">
                            <div>
                                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#344054]">
                                    Work Email <sup>*</sup>
                                </label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3 text-[#667085]"><MailIcon size={20} /></span>
                                    <input
                                        type="email"
                                        id="email"
                                        name='email'
                                        placeholder='Email'
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={cn("w-full rounded-lg border border-[#D0D5DD]",
                                            "px-4 py-2.5 text-gray-700 placeholder:text-[#667085] pl-10",
                                            "focus:border-blue-200 focus:ring-2 focus:ring-blue-200 focus:outline-none")}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-[#344054]">
                                    Phone Number <sup>*</sup>
                                </label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3 text-[#667085]"><Phone size={20} /></span>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name='phone'
                                        placeholder='Phone'
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={cn("w-full rounded-lg border border-[#D0D5DD]",
                                            "px-4 py-2.5 text-gray-700 placeholder:text-[#667085] pl-10",
                                            "focus:border-blue-200 focus:ring-2 focus:ring-blue-200 focus:outline-none")}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Row 3: Organization & Job Position */}

                        <div className="grid grid-cols-2 gap-x-4 mb-6">
                            <div>
                                <label htmlFor="organization" className="mb-1.5 block text-sm font-medium text-[#344054]">
                                    Organization <sup>*</sup>
                                </label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3 text-[#667085]"><Briefcase size={20} /></span>
                                    <input
                                        type="text"
                                        id="organization"
                                        name='organization'
                                        placeholder='Organization'
                                        value={formData.organization}
                                        onChange={handleChange}
                                        className={cn("w-full rounded-lg border border-[#D0D5DD]",
                                            "px-4 py-2.5 text-gray-700 placeholder:text-[#667085] pl-10",
                                            "focus:border-blue-200 focus:ring-2 focus:ring-blue-200 focus:outline-none")}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="job" className="mb-1.5 block text-sm font-medium text-[#344054]">
                                    Job Position <sup>*</sup>
                                </label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3 text-[#667085]"><Briefcase size={20} /></span>
                                    <input
                                        type="text"
                                        id="job"
                                        name='job'
                                        placeholder='Position'
                                        value={formData.job}
                                        onChange={handleChange}
                                        className={cn("w-full rounded-lg border border-[#D0D5DD]",
                                            "px-4 py-2.5 text-gray-700 placeholder:text-[#667085] pl-10",
                                            "focus:border-blue-200 focus:ring-2 focus:ring-blue-200 focus:outline-none")}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Row 4: Country (Full Width) */}

                        <div className="mb-6">
                            <label htmlFor="country" className="mb-1.5 block text-sm font-medium text-[#344054]">
                                Country <sup>*</sup>
                            </label>
                            <div className="relative flex items-center">
                                <span className="absolute left-3 text-[#667085]"><Globe size={20} /></span>
                                <select
                                    id="country"
                                    name='country'
                                    value={formData.country}
                                    onChange={handleChange}
                                    className={cn("w-full rounded-lg border border-[#D0D5DD]",
                                        "px-4 py-2.5 text-gray-700 placeholder:text-[#667085] pl-10",
                                        "focus:border-blue-200 focus:ring-2 focus:ring-blue-200 focus:outline-none",
                                        "bg-white appearance-none")}
                                >
                                    <option value="">Select Country</option>
                                    <option value="egy">Egypt</option>
                                    <option value="us">United States</option>
                                    <option value="uk">United Kingdom</option>


                                </select>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={cn(
                                'h-10 w-full rounded-lg py-2 px-4 font-medium transition duration-300 ease-in-out',
                                'inline-flex items-center justify-center gap-2',
                                'bg-slate-900 text-white hover:bg-slate-700',
                                'disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed'
                            )}
                        >
                            {loading ? (
                                <LoaderCircle className="animate-spin" color={loading ? "#9CA3AF" : "#fff"} />
                            ) : (
                                'Get Started'
                            )}
                        </button>
                    </form>

                    {/* Sign-in Link */}
                    <div className="mt-4 text-center">
                        <span className="text-sm text-gray-600">Already have an account? </span>

                        <Link to='/organizer/login' className="text-sm font-medium text-blue-600 hover:underline" >

                            Sign in
                        </Link>

                    </div>
                </div>
            </div>
        </>
    )
}

export default RegisterAttendee
