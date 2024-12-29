

'use client'


import React, { useEffect, useContext, useState } from 'react';
import AdminContext from '../../Context/AdminContext';
import Spinner from './loader';
import bgImage from "../../public/Background.jpg";

const PersonelInformation = () => {
  const { getProfile } = useContext(AdminContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (localStorage.getItem("token")) {
        const profileData = await getProfile();
        setProfile(profileData);
      }
    };
    fetchProfile();
  }, [getProfile]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  
  return (
    <div className="w-auto h-auto flex justify-center mt-20 items-center">
      {loading ? (
        <Spinner/>
      ) : (
        <div className="p-2 bg-white rounded-md shadow-md w-full max-w-md">
          <h2
            className="text-2xl bg-cover w-full font-semibold text-white mb-7 p-4 rounded-md"
            style={{
              backgroundImage: `url(${bgImage.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            Profile Information
          </h2>
          <div className="flex items-center mb-4">
            {profile?.profilePicture ? (
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${profile.profilePicture}`}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
          </div>
          <div className="space-y-6">
            <div>
              <span className="font-medium text-gray-700">User Name:</span>{' '}
              <span>{profile?.username || 'N/A'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Phone Number:</span>{' '}
              <span>{profile?.phoneNumber || 'N/A'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Date of Birth:</span>{' '}
              <span>{profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Institution:</span>{' '}
              <span>{profile?.institution || 'N/A'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Grade/Year:</span>{' '}
              <span>{profile?.gradeYear || 'N/A'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Subjects of Interest:</span>{' '}
              <span>{profile?.subjectsOfInterest?.length > 0 ? profile.subjectsOfInterest.join(', ') : 'N/A'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonelInformation;
