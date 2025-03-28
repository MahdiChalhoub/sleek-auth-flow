
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Client } from '@/models/client';
import { clientsApi } from '@/api/database';

// Define the validation schema for client form
const clientFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }).optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
  type: z.enum(['regular', 'vip', 'credit', 'wholesale']),
  notes: z.string().optional().or(z.literal('')),
  status: z.enum(['active', 'inactive']),
  tags: z.array(z.string()).optional(),
  creditLimit: z.number().optional(),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;

export const useClientForm = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [client, setClient] = useState<Client | null>(null);

  // Initialize the form
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      type: 'regular',
      notes: '',
      status: 'active',
      tags: [],
      creditLimit: undefined,
    },
  });

  // Load client data if editing an existing client
  useEffect(() => {
    if (clientId) {
      setIsLoading(true);
      clientsApi.getById(clientId)
        .then((data) => {
          if (data) {
            setClient(data);
            // Update form with client data
            form.reset({
              name: data.name,
              email: data.email || '',
              phone: data.phone || '',
              address: data.address || '',
              city: data.city || '',
              country: data.country || '',
              type: data.type as 'regular' | 'vip' | 'credit' | 'wholesale',
              notes: data.notes || '',
              status: data.status as 'active' | 'inactive',
              tags: data.tags || [],
              creditLimit: data.credit_limit,
            });
          }
        })
        .catch((error) => {
          console.error('Error loading client data:', error);
          toast({
            title: 'Error',
            description: 'Failed to load client data. Please try again.',
            variant: 'destructive',
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [clientId, form, toast]);

  // Handle form submission
  const onSubmit = async (data: ClientFormValues) => {
    setIsLoading(true);

    try {
      if (clientId) {
        // Update existing client
        await clientsApi.update(clientId, {
          ...data,
          updatedAt: new Date().toISOString(),
        });
        toast({
          title: 'Success',
          description: 'Client updated successfully',
        });
      } else {
        // Create new client
        await clientsApi.create({
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Omit<Client, 'id'>);
        toast({
          title: 'Success',
          description: 'Client created successfully',
        });
      }
      navigate('/clients');
    } catch (error) {
      console.error('Error saving client:', error);
      toast({
        title: 'Error',
        description: 'Failed to save client. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    onSubmit,
    isLoading,
    client,
    isEditMode: !!clientId,
  };
};
