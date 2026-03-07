'use client';
import { Button } from "../ui/button";
import ProfileFormHeader from "../modules/Dashboard/Profile/ProfileFormHeader";
import ProfileFormBasicInfo from "../modules/Dashboard/Profile/ProfileFormBasicInfo";
import { useUpdateProfileMutation } from "@/redux/featured/adminprofile/adminprofileApi";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectCurrentUser, setUser } from "@/redux/featured/auth/authSlice";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface ProfileFormProps {
  mode?: "view" | "edit";
  onClose?: () => void;
}

export default function ProfileForm({ mode = "view", onClose }: ProfileFormProps) {
  const isViewMode = mode === "view";
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    gender: user?.gender || 'male',
    contactNo: user?.contactNo || '',
    bio: user?.bio || ''
  });

  // Update formData when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        gender: user.gender || 'male',
        contactNo: user.contactNo || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userId = user?._id;
      if (!userId) {
        toast.error('User ID not found');
        return;
      }
      
      const updateData = {
        userId,
        email: user?.email,
        ...formData
      };
      
      console.log('Sending update data:', updateData); // Debug log
      
      const response = await updateProfile(updateData).unwrap();
      
      console.log('Update response:', response); // Debug log
      
      if (response.success) {
        // Fetch fresh user data from /auth/me to get updated profile
        try {
          const freshUserData = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          });
          const freshUser = await freshUserData.json();
          
          if (freshUser.success) {
            dispatch(setUser({
              user: freshUser.data,
              accessToken: localStorage.getItem('accessToken')
            }));
          }
        } catch (error) {
          // Fallback to local update if fetch fails
          dispatch(setUser({
            user: { ...user, ...formData },
            accessToken: localStorage.getItem('accessToken')
          }));
        }
        
        toast.success('Profile updated successfully!');
        onClose?.();
      }
    } catch (error: any) {
      console.error('Update error:', error); // Debug log
      toast.error(error?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ProfileFormHeader isViewMode={isViewMode} />
      <ProfileFormBasicInfo 
        isViewMode={isViewMode} 
        formData={formData}
        setFormData={setFormData}
      />
      
      {!isViewMode && (
        <div className="flex justify-center mt-6">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      )}
    </form>
  );
}
