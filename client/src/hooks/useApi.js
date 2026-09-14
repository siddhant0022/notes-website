import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, resourcesApi, subjectsApi, adminApi } from '../api';
import { useAuthStore } from '../store';
import toast from 'react-hot-toast';

export const useMe = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        const { data } = await authApi.getMe();
        setUser(data.data.user);
        return data.data.user;
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
          return null;
        }
        throw err;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePublicStats = () =>
  useQuery({
    queryKey: ['stats', 'public'],
    queryFn: async () => {
      const { data } = await resourcesApi.getPublicStats();
      return data.data;
    },
    staleTime: 2 * 60 * 1000,
  });

export const useLogin = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (credentials) => authApi.login(credentials),
    onSuccess: ({ data }) => {
      setUser(data.data.user);
      qc.setQueryData(['me'], data.data.user);
      toast.success('Welcome back!');
    },
  });
};

export const useRegister = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload) => authApi.register(payload),
    onSuccess: ({ data }) => {
      setUser(data.data.user);
      qc.setQueryData(['me'], data.data.user);
      toast.success('Account created!');
    },
  });
};

export const useLogout = () => {
  const logout = useAuthStore((s) => s.logout);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logout();
      qc.clear();
      toast.success('Logged out');
    },
  });
};

export const useResources = (params = {}) =>
  useQuery({
    queryKey: ['resources', params],
    queryFn: async () => {
      const { data } = await resourcesApi.getAll(params);
      return data.data;
    },
  });

export const useResource = (id) =>
  useQuery({
    queryKey: ['resource', id],
    queryFn: async () => {
      const { data } = await resourcesApi.getById(id);
      return data.data.resource;
    },
    enabled: !!id,
  });

export const useStarredResources = () =>
  useQuery({
    queryKey: ['starred'],
    queryFn: async () => {
      const { data } = await resourcesApi.getStarred();
      return data.data.resources;
    },
  });

export const useToggleStar = () => {
  const qc = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (id) => resourcesApi.toggleStar(id),
    onSuccess: ({ data }, id) => {
      qc.invalidateQueries({ queryKey: ['starred'] });
      qc.invalidateQueries({ queryKey: ['resources'] });
      qc.invalidateQueries({ queryKey: ['resource', id] });

      authApi.getMe().then(({ data: meData }) => {
        setUser(meData.data.user);
      });

      toast.success(data.message);
    },
  });
};

export const useUploadResource = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (formData) => resourcesApi.upload(formData),
    onSuccess: ({ data }) => {
      qc.invalidateQueries({ queryKey: ['resources'] });
      toast.success(data.message);
    },
  });
};

export const useSubjects = (params = {}) =>
  useQuery({
    queryKey: ['subjects', params],
    queryFn: async () => {
      const { data } = await subjectsApi.getAll(params);
      return data.data;
    },
    staleTime: 10 * 60 * 1000,
  });

export const useAdminStats = () =>
  useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const { data } = await adminApi.getStats();
      return data.data;
    },
  });

export const usePendingResources = (params = {}) =>
  useQuery({
    queryKey: ['admin', 'pending', params],
    queryFn: async () => {
      const { data } = await adminApi.getPending(params);
      return data.data;
    },
  });

export const useModerateResource = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, action, reason }) =>
      action === 'approve'
        ? adminApi.approve(id)
        : adminApi.reject(id, reason),
    onSuccess: ({ data }) => {
      qc.invalidateQueries({ queryKey: ['admin'] });
      qc.invalidateQueries({ queryKey: ['resources'] });
      toast.success(data.message);
    },
  });
};

export const useAdminUsers = (params = {}) =>
  useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: async () => {
      const { data } = await adminApi.getUsers(params);
      return data.data;
    },
  });

export const useUpdateUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => adminApi.updateUser(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User updated');
    },
  });
};

export const useCreateSubject = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => subjectsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['subjects'] });
      toast.success('Subject created');
    },
  });
};

export const useUpdateSubject = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => subjectsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['subjects'] });
      toast.success('Subject updated');
    },
  });
};

export const useDeleteSubject = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id) => subjectsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['subjects'] });
      toast.success('Subject deactivated');
    },
  });
};

export const downloadFile = async (resource) => {
  const { data } = await resourcesApi.download(resource._id);
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement('a');
  link.href = url;
  link.download = resource.fileName;
  link.click();
  window.URL.revokeObjectURL(url);
};
