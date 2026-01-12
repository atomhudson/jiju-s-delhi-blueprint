import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';

// Generate a unique visitor ID for anonymous tracking
const getVisitorId = (): string => {
  let visitorId = localStorage.getItem('visitor_id');
  if (!visitorId) {
    visitorId = 'v_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('visitor_id', visitorId);
  }
  return visitorId;
};

// Hook to track page views
export const usePageView = () => {
  const location = useLocation();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        const visitorId = getVisitorId();
        await supabase.from('page_views').insert({
          page_path: location.pathname,
          visitor_id: visitorId,
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
        });
      } catch (error) {
        // Silently fail - analytics shouldn't break the app
        console.error('Failed to track page view:', error);
      }
    };

    trackPageView();
  }, [location.pathname]);
};

// Hook to track project views
export const useProjectView = (projectId: string | undefined) => {
  useEffect(() => {
    if (!projectId) return;

    const trackProjectView = async () => {
      try {
        const visitorId = getVisitorId();
        await supabase.from('project_views').insert({
          project_id: projectId,
          visitor_id: visitorId,
        });
      } catch (error) {
        console.error('Failed to track project view:', error);
      }
    };

    trackProjectView();
  }, [projectId]);
};

// Hook to manage project likes
export const useProjectLike = (projectId: string) => {
  const visitorId = getVisitorId();

  const checkIfLiked = useCallback(async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('project_likes')
        .select('id')
        .eq('project_id', projectId)
        .eq('visitor_id', visitorId)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking like status:', error);
        return false;
      }
      return !!data;
    } catch {
      return false;
    }
  }, [projectId, visitorId]);

  const toggleLike = useCallback(async (): Promise<boolean> => {
    try {
      const isLiked = await checkIfLiked();
      
      if (isLiked) {
        await supabase
          .from('project_likes')
          .delete()
          .eq('project_id', projectId)
          .eq('visitor_id', visitorId);
        return false;
      } else {
        await supabase
          .from('project_likes')
          .insert({ project_id: projectId, visitor_id: visitorId });
        return true;
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      throw error;
    }
  }, [projectId, visitorId, checkIfLiked]);

  return { checkIfLiked, toggleLike, visitorId };
};

// Get like count for a project
export const getProjectLikeCount = async (projectId: string): Promise<number> => {
  try {
    const { count } = await supabase
      .from('project_likes')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId);
    return count || 0;
  } catch {
    return 0;
  }
};

// Export visitor ID getter for other uses
export { getVisitorId };
