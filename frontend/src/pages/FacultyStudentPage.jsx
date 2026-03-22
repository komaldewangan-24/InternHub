import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppShell from '../components/AppShell';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import StatusBadge from '../components/StatusBadge';
import { navigationByRole } from '../constants/navigation';
import useCurrentUser from '../hooks/useCurrentUser';
import { projectAPI, userAPI } from '../services/api';

export default function FacultyStudentPage() {
  const { studentId } = useParams();
  const { user, loading } = useCurrentUser();
  const [projects, setProjects] = useState([]);
  const [portfolio, setPortfolio] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setPageLoading(true);
        const [projectResponse, portfolioResponse] = await Promise.all([
          projectAPI.getAll({ studentId }),
          userAPI.getPortfolio(studentId),
        ]);
        setProjects(projectResponse.data.data || []);
        setPortfolio(portfolioResponse.data.data || null);
      } finally {
        setPageLoading(false);
      }
    };

    loadProjects();
  }, [studentId]);

  if (loading || pageLoading) {
    return <LoadingState label="Loading student submissions..." />;
  }

  return (
    <AppShell
      title="Faculty Student View"
      description="See all submissions for the selected student that are assigned to you."
      navigation={navigationByRole.faculty}
      user={user}
    >
      {portfolio ? (
        <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-slate-500">Student</p>
              <p className="mt-2 text-lg font-bold">{portfolio.student?.name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Department</p>
              <p className="mt-2 text-lg font-bold">{portfolio.student?.profile?.department || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Batch</p>
              <p className="mt-2 text-lg font-bold">{portfolio.student?.profile?.batch || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Readiness</p>
              <p className="mt-2 text-lg font-bold">{portfolio.readiness?.score || 0}%</p>
            </div>
          </div>
        </div>
      ) : null}
      <div className="space-y-4">
        {projects.length ? (
          projects.map((project) => (
            <div key={project._id} className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-bold">{project.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{project.student?.name}</p>
                </div>
                <StatusBadge status={project.status} />
              </div>
              <p className="mt-4 text-sm text-slate-600">{project.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(project.tags || []).map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <EmptyState title="No assigned submissions" description="This student does not have any project submissions assigned to you." />
        )}
      </div>
    </AppShell>
  );
}
