'use client'

import React, { useContext, useState, useEffect } from 'react';
import AdminContext from '../../Context/AdminContext';
import  Spinner  from './loader';


const Profile = () => {
  const { deleteProfile, createProfile,getProfile } = useContext(AdminContext);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    userId: '',
    profilePicture: '',
    username:'',
    phoneNumber: '',
    dateOfBirth: '',
    institution: '',
    gradeYear: '',
    subjectsOfInterest: ''
  });

  

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getProfile();
      if (profile) {
        setProfileData({
          userId: profile.userId || '',
          username: profile.username || '',
          phoneNumber: profile.phoneNumber || '',
          dateOfBirth: profile.dateOfBirth || '',
          institution: profile.institution || '',
          gradeYear: profile.gradeYear || '',
          subjectsOfInterest: profile.subjectsOfInterest ? profile.subjectsOfInterest.join(', ') : '',
          profilePicture: profile.profilePicture || ''
        });
      }

      // setLoading(false); // End loading state after fetching data

    };


    // Only fetch if userId is empty, meaning profileData hasn't been set yet
    if (!profileData.userId) {
      fetchProfile();
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer); 

  }, [getProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };


  const handleFileChange = (e) => {
    setProfileData({ ...profileData, profilePicture: e.target.files[0] });
  };

  



  const handleCreateProfile = async (e) => {
    e.preventDefault();

    // Convert the subjectsOfInterest string to an array by splitting on commas
    const formattedProfileData = {
      ...profileData,
      subjectsOfInterest: profileData.subjectsOfInterest
        ? profileData.subjectsOfInterest.split(',').map(subject => subject.trim())
        : []
    };

    await createProfile(formattedProfileData);

    // Reset form data after creation
    setProfileData({
      userId: '',
      profilePicture: '',
      username: '',
      phoneNumber: '',
      dateOfBirth: '',
      institution: '',
      gradeYear: '',
      subjectsOfInterest: ''
    });
};

  

  const handleDeleteProfile = async () => {
    if (!profileData.userId) {
      console.error('User ID is required to delete the profile.');
      return;
    }
    await deleteProfile(profileData.userId);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
       {loading ? (
        <div className="flex items-center justify-center h-64">
          <Spinner />
        </div>
      ) : (
      <>
      {/* <h1 className="text-2xl font-bold mb-6">Your Profile</h1> */}
      <form className="space-y-6" encType="multipart/form-data">
        <div>
          <label className="block font-semibold mb-1">Profile Picture</label>
          <input
            type="file"
            name="profilePicture"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">User Name</label>
          <input
            type="text"
            name="username"
            value={profileData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={profileData.phoneNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={profileData.dateOfBirth}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Institution</label>
          <input
            type="text"
            name="institution"
            value={profileData.institution}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Grade/Year</label>
          <input
            type="text"
            name="gradeYear"
            value={profileData.gradeYear}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Subjects of Interest</label>
          <input
            type="text"
            name="subjectsOfInterest"
            value={profileData.subjectsOfInterest}
            onChange={(e) =>
              setProfileData({
                ...profileData,
                subjectsOfInterest: e.target.value
              })
            }
            placeholder="Separate subjects with commas"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
          />
        </div>
      </form>

      <button
        onClick={handleCreateProfile}
        className="w-full mt-4 py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none"
      >
        Create Profile
      </button>

      <button
        onClick={handleDeleteProfile}
        className="w-full mt-4 py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none"
      >
        Delete Profile
      </button>
      </>
      )}
    </div>
  );
};

export default Profile;
