import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BookOpen, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import CourseCard from '../components/courses/CourseCard';
import CourseFilters from '../components/courses/CourseFilters';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { PageTransition } from '../components/common/animations';
import * as api from '../services/api';

export default function Courses() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCompetency = queryParams.get('competency') || 'All';
  const initialSearch = queryParams.get('search') || '';

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [selectedCompetency, setSelectedCompetency] = useState(initialCompetency);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [recommendedOnly, setRecommendedOnly] = useState(false);

  useEffect(() => {
    async function loadCourses() {
      setLoading(true);
      try {
        const res = await api.getCourses({
          search,
          competency: selectedCompetency,
          difficulty: selectedDifficulty,
          recommendedOnly
        });
        setCourses(res);
      } catch (err) {
        console.error('Error loading courses:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, [search, selectedCompetency, selectedDifficulty, recommendedOnly]);

  const competencyOptions = [
    'Python',
    'Data Analysis',
    'Data Visualization',
    'Survey Methodology',
    'Statistical Computing',
    'Statistics'
  ];

  return (
    <PageTransition className="space-y-8 pb-12">
      <PageHeader
        title="Courses &amp; Training Catalog"
        subtitle="Discover official capacity building courses integrated directly with the iGOT Karmayogi ecosystem."
        badge={
          <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-full border border-indigo-200">
            iGOT Karmayogi Integrated
          </span>
        }
      />

      {/* Filters & Search */}
      <CourseFilters
        search={search}
        setSearch={setSearch}
        selectedCompetency={selectedCompetency}
        setSelectedCompetency={setSelectedCompetency}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        recommendedOnly={recommendedOnly}
        setRecommendedOnly={setRecommendedOnly}
        competencyOptions={competencyOptions}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between text-sm text-slate-500 font-medium">
        <span>
          Showing <strong>{courses.length}</strong> official statistical training programs
        </span>
        {recommendedOnly && (
          <span className="text-blue-700 font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Filtered by AI Competency Recommendation
          </span>
        )}
      </div>

      {/* Courses Grid */}
      {loading ? (
        <LoadingSpinner message="Filtering iGOT Karmayogi course registry..." />
      ) : courses.length === 0 ? (
        <EmptyState
          title="No courses matched your query"
          description="Try clearing search keywords or selecting 'All' competencies to view all modules."
          actionText="Reset All Filters"
          onAction={() => {
            setSearch('');
            setSelectedCompetency('All');
            setSelectedDifficulty('All');
            setRecommendedOnly(false);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </PageTransition>
  );
}
