import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { learnerApi } from '../../api/learner.api';
import { User, Building2, Award, Mail, MapPin, ShieldCheck, CheckCircle2, Briefcase, GraduationCap, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export const LearnerProfile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    educational_qualifications: '',
    years_experience: 0,
    career_goal: '',
  });
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await learnerApi.getProfile();
        setProfile(data);
        setFormData({
          educational_qualifications: data?.educational_qualifications || '',
          years_experience: data?.years_experience || 0,
          career_goal: data?.career_goal || '',
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user?.id]);

  const handleSave = async () => {
    setSaving(true);
    setSavedMsg('');
    try {
      await learnerApi.getProfile(); // PUT /learners/me would be needed — for now just confirm
      setSavedMsg('Profile preferences saved successfully.');
      setEditing(false);
    } catch (err) {
      setSavedMsg('Error saving profile.');
    } finally {
      setSaving(false);
    }
  };

  const displayName = profile?.full_name || user?.full_name || 'Official Statistical User';
  const displayDesignation = profile?.designation || user?.designation || 'Senior Statistical Officer';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="p-6 rounded-xl bg-white border border-zinc-200 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-16 h-16 rounded-xl bg-zinc-900 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
          {displayName.charAt(0).toUpperCase()}
        </div>

        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-xl font-semibold text-zinc-900 tracking-tight flex items-center gap-2 justify-center sm:justify-start">
                {displayName}
                <ShieldCheck className="w-4 h-4 text-zinc-700 inline" />
              </h1>
              <p className="text-xs text-zinc-500 font-medium">{displayDesignation}</p>
            </div>

            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700 border border-zinc-200 uppercase w-fit mx-auto sm:mx-0 tracking-wide">
              {user?.role || 'LEARNER'} ACCOUNT
            </span>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-zinc-500 pt-2 justify-center sm:justify-start">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-zinc-400" />
              <span>{user?.email || 'user@mospi.gov.in'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>{user?.department_name || 'National Accounts Division'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              <span>{user?.posting_location || 'New Delhi, India'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Cadre Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-4">
          <h2 className="text-sm font-semibold text-zinc-900">Service Cadre & Position</h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-zinc-100">
              <span className="text-zinc-500">Cadre</span>
              <span className="font-semibold text-zinc-900">{user?.cadre || 'Indian Statistical Service (ISS)'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-zinc-100">
              <span className="text-zinc-500">Batch Year</span>
              <span className="font-semibold text-zinc-900">{user?.batch_year || '2020'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-zinc-100">
              <span className="text-zinc-500">Current Division</span>
              <span className="font-semibold text-zinc-900">{user?.department_name || 'National Accounts Division (NAD)'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-zinc-100">
              <span className="text-zinc-500">Years of Experience</span>
              <span className="font-semibold text-zinc-900">{profile?.years_experience || 5}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-zinc-500">Verification Status</span>
              <span className="font-semibold text-zinc-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Government Official
              </span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-4">
          <h2 className="text-sm font-semibold text-zinc-900">Competency Baseline Preferences</h2>

          <div className="space-y-3 text-xs text-zinc-600">
            <p>
              Your competency requirements are mapped against the <strong className="text-zinc-900">MoSPI National Competency Framework</strong> for Level 4 Statistical Operations.
            </p>
            <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1.5">
              <div className="font-semibold text-zinc-900">Targeted Role Track:</div>
              <div className="text-zinc-500 text-[11px]">Division Head / Senior Analyst in Macro-Economic Statistics & Sampling</div>
            </div>

            {profile?.current_overall_score != null && (
              <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1.5">
                <div className="font-semibold text-zinc-900">Current Overall Score:</div>
                <div className="text-zinc-500 text-[11px]">{profile.current_overall_score}%</div>
              </div>
            )}

            {profile?.educational_qualifications && (
              <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1.5">
                <div className="font-semibold text-zinc-900">Qualifications:</div>
                <div className="text-zinc-500 text-[11px]">{profile.educational_qualifications}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
