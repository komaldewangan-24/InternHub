import React from 'react';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';

export default function LegacyInternshipRedirect() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const id = params.id || searchParams.get('id');

  return <Navigate replace to={id ? `/internships/${id}` : '/internships'} />;
}
