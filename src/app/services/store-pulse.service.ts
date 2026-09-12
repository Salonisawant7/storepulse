import { Injectable, signal, computed } from '@angular/core';

export type UserRole = 'ADMIN' | 'STORE_OWNER' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: UserRole;
  avatarUrl?: string;
  twoFactorEnabled?: boolean;
  storeId?: string; // If STORE_OWNER
  storeName?: string;
  createdAt: string;
}

export interface Store {
  id: string;
  name: string;
  code: string;
  category: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  address: string;
  city: string;
  imageUrl: string;
  averageRating: number;
  ratingCount: number;
  status: 'ACTIVE' | 'PENDING_AUDIT' | 'SUSPENDED';
  createdAt: string;
}

export interface StoreRating {
  id: string;
  storeId: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number; // 1 to 5
  feedback?: string;
  createdAt: string;
  updatedAt?: string;
  verifiedShopper: boolean;
}

export interface PlatformEvent {
  id: string;
  type: 'USER_REGISTERED' | 'STORE_ONBOARDED' | 'RATING_SUBMITTED' | 'PRIVILEGE_UPDATED';
  title: string;
  description: string;
  timestamp: string;
  badge: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error' | 'warning';
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class StorePulseService {
  // Current Authenticated User Session
  readonly currentUser = signal<User>({
    id: 'user-admin-1',
    name: 'Marcus Sterling',
    email: 'admin@storerating.com',
    address: '100 Innovation Way, Suite 400, Bellevue, WA 98004',
    role: 'ADMIN',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqLJM0nR1jwMMfF2dbnN1_Y8xqZxLshMDUKo4_WOshGYNMTQlM2J47OPs-1O7yyG8uzqE8Bz-f1z27o25VCP3xkvvhLRlDCZhjUlpLub5OTS5mCS2OLygxr2H00R0VtSROm5oh96I2a2nDhih4IpZVlhWRtIrcqXEwDGrHYBZplTeeEiaoqJV0jPMXIgfBmHMZn-GdXiGLG7QdKYLM5YP6QDKRKILih97AoYe98nTfZCH_eHceVfhN1w',
    twoFactorEnabled: true,
    createdAt: '2023-01-15'
  });

  // Simulation mode role
  readonly currentRole = computed(() => this.currentUser().role);

  // Registered Users
  readonly users = signal<User[]>([
    {
      id: 'user-admin-1',
      name: 'Marcus Sterling',
      email: 'admin@storerating.com',
      address: '100 Innovation Way, Suite 400, Bellevue, WA 98004',
      role: 'ADMIN',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqLJM0nR1jwMMfF2dbnN1_Y8xqZxLshMDUKo4_WOshGYNMTQlM2J47OPs-1O7yyG8uzqE8Bz-f1z27o25VCP3xkvvhLRlDCZhjUlpLub5OTS5mCS2OLygxr2H00R0VtSROm5oh96I2a2nDhih4IpZVlhWRtIrcqXEwDGrHYBZplTeeEiaoqJV0jPMXIgfBmHMZn-GdXiGLG7QdKYLM5YP6QDKRKILih97AoYe98nTfZCH_eHceVfhN1w',
      twoFactorEnabled: true,
      createdAt: '2023-01-15'
    },
    {
      id: 'user-owner-1',
      name: 'Rajesh Patil',
      email: 'owner@abcstore.com',
      address: '42 Deccan Gymkhana, FC Road, Pune, Maharashtra 411004',
      role: 'STORE_OWNER',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOmjRNemEo6rCabSeYpk8-uG0vz0WryZ2LIlCoFqNdKRsFyFlWzswcePeHMudzCYSI7W5Lsigh_RL-t_HHf-QV5OIFZKGpW6hSZSh6VDmTbQpHAtoELH82dSBqpX92ezGNjd58qxzdRc4zC6pchqCmkF0CZM7J8QVnYAEnaY4iGhWZqwdCMlAUyL0tkcdkEMngfceZsX52ny1mkExYRV2PYSJE4hyv8azBd-7MYVEmRzTf0WEe26IboA',
      storeId: 'store-quickbite',
      storeName: 'QuickBite Mart',
      twoFactorEnabled: true,
      createdAt: '2023-06-20'
    },
    {
      id: 'user-owner-2',
      name: 'Eleanor Vance',
      email: 'owner@aurabakery.com',
      address: '120 Pike Place Market, Seattle, WA 98101',
      role: 'STORE_OWNER',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqLJM0nR1jwMMfF2dbnN1_Y8xqZxLshMDUKo4_WOshGYNMTQlM2J47OPs-1O7yyG8uzqE8Bz-f1z27o25VCP3xkvvhLRlDCZhjUlpLub5OTS5mCS2OLygxr2H00R0VtSROm5oh96I2a2nDhih4IpZVlhWRtIrcqXEwDGrHYBZplTeeEiaoqJV0jPMXIgfBmHMZn-GdXiGLG7QdKYLM5YP6QDKRKILih97AoYe98nTfZCH_eHceVfhN1w',
      storeId: 'store-aura-bakery',
      storeName: 'Aura Artisanal Bakery',
      twoFactorEnabled: true,
      createdAt: '2023-08-11'
    },
    {
      id: 'user-owner-3',
      name: 'Carlos Mendoza',
      email: 'owner@greenline.com',
      address: '500 N Michigan Ave, Chicago, IL 60611',
      role: 'STORE_OWNER',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOmjRNemEo6rCabSeYpk8-uG0vz0WryZ2LIlCoFqNdKRsFyFlWzswcePeHMudzCYSI7W5Lsigh_RL-t_HHf-QV5OIFZKGpW6hSZSh6VDmTbQpHAtoELH82dSBqpX92ezGNjd58qxzdRc4zC6pchqCmkF0CZM7J8QVnYAEnaY4iGhWZqwdCMlAUyL0tkcdkEMngfceZsX52ny1mkExYRV2PYSJE4hyv8azBd-7MYVEmRzTf0WEe26IboA',
      storeId: 'store-greenline',
      storeName: 'Greenline Supermarket',
      twoFactorEnabled: false,
      createdAt: '2023-11-04'
    },
    {
      id: 'user-shopper-1',
      name: 'Jennifer Miller',
      email: 'john.doe@example.com',
      address: '742 Evergreen Terrace, Springfield, OR 97477',
      role: 'USER',
      twoFactorEnabled: true,
      createdAt: '2024-01-10'
    },
    {
      id: 'user-shopper-2',
      name: 'David Kim',
      email: 'david.kim@techreview.io',
      address: '1500 Broadway, New York, NY 10036',
      role: 'USER',
      twoFactorEnabled: true,
      createdAt: '2024-02-14'
    },
    {
      id: 'user-shopper-3',
      name: 'Sarah Jenkins',
      email: 'sarah.j@consumerpulse.org',
      address: '220 Pinecrest Dr, Austin, TX 78704',
      role: 'USER',
      twoFactorEnabled: false,
      createdAt: '2024-03-02'
    },
    {
      id: 'user-shopper-4',
      name: 'Ananya Deshmukh',
      email: 'ananya.d@maharashtra.in',
      address: '88 Shivaji Nagar, Pune, Maharashtra 411005',
      role: 'USER',
      twoFactorEnabled: true,
      createdAt: '2024-03-22'
    },
    {
      id: 'user-shopper-5',
      name: 'Vikram Malhotra',
      email: 'vikram.malhotra@zenith.org',
      address: '14 Koregaon Park Road, Pune, Maharashtra 411001',
      role: 'USER',
      twoFactorEnabled: true,
      createdAt: '2024-04-05'
    }
  ]);

  // Monitored Stores
  readonly stores = signal<Store[]>([
    {
      id: 'store-quickbite',
      name: 'QuickBite Mart',
      code: 'STR-8834',
      category: 'Grocery & Convenience',
      ownerId: 'user-owner-1',
      ownerName: 'Rajesh Patil',
      ownerEmail: 'owner@abcstore.com',
      address: '42 Deccan Gymkhana, FC Road, Pune, Maharashtra 411004',
      city: 'Pune, Maharashtra',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGQDAWrTXQ4F7ktX4vqqOpC7cuTGtfKsesiLbZRnrKNHx3UIGjAzljPGJ8bfF7ATqxCZonDJK-VO4-kwBbUamJJde7dLy7EVeNZ71NQLdLwyi8ikeg_1Bgr1wiwZ6nyYmyxFtkX0BJY5N3Eo4SVx6fevms4OWLVyy_LTqhU_c3QJMG0Ss_1NhI2IT7UGKUpoRGeYIBT8dVXdhYF-mEDBolIxxE5xmv26gZ_9lxCJikMgoyBIBHQ00Rfg',
      averageRating: 4.6,
      ratingCount: 128,
      status: 'ACTIVE',
      createdAt: '2023-06-25'
    },
    {
      id: 'store-urban-tech',
      name: 'Urban Tech Flagship',
      code: 'STR-9041',
      category: 'Electronics & Gadgets',
      ownerId: 'user-shopper-2',
      ownerName: 'David Kim',
      ownerEmail: 'david.kim@techreview.io',
      address: '1500 Broadway, 4th Floor, Times Square, New York, NY 10036',
      city: 'New York, NY',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUWUp1QQL8-i-QdjLLuA9fV_nUnbeo1VAu2LsklTbVNpYBgU7pTEAUpYZrOnNoQptJUMbRQ2FrORvBWVdbYwj36ssF2ckMLRqGPSk1BgSKK67dKsCYlfANWcIIqqaKcQTenrTHASfKeZpLjYOq0Ctk__ygnF12MlM_NjlBbRQ7L0VrvE_zKwgvminRwqzyfH9NsDuuRrcEk8lR1KsuyYXh0n3XItKuB23KcAX-oREglb1yLqRF2CTi0w',
      averageRating: 4.1,
      ratingCount: 86,
      status: 'ACTIVE',
      createdAt: '2023-09-12'
    },
    {
      id: 'store-aura-bakery',
      name: 'Aura Artisanal Bakery',
      code: 'STR-4412',
      category: 'Artisanal Bakery & Cafe',
      ownerId: 'user-owner-2',
      ownerName: 'Eleanor Vance',
      ownerEmail: 'owner@aurabakery.com',
      address: '120 Pike Place Market, Seattle, WA 98101',
      city: 'Seattle, WA',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEgSayOd-t0hvLBPZDJlaqKpuXbvVQWOmaVdjzUyeSH02_wfCTFp9xUNG7tFlZNRjDCYiTGI1sJCmkVBuA1J7n27vmqvGBueBp0FRzL7T28xEFiS_bc1BM3s4dZj1PF0DNThqPuVYYJJUQ0DX9B-vs4miQUvTF3lWBdXDWBMww-MDNymyInKWBBleGG6cYzZL2ze3N5mdW_jNLJOvdEs8M39LhcuF5Io00hfPpsVwc4BkgEC69Bfv6FQ',
      averageRating: 4.9,
      ratingCount: 214,
      status: 'ACTIVE',
      createdAt: '2023-08-15'
    },
    {
      id: 'store-greenline',
      name: 'Greenline Supermarket',
      code: 'STR-2190',
      category: 'Supermarket & Produce',
      ownerId: 'user-owner-3',
      ownerName: 'Carlos Mendoza',
      ownerEmail: 'owner@greenline.com',
      address: '500 N Michigan Ave, Magnificent Mile, Chicago, IL 60611',
      city: 'Chicago, IL',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKjxu8yLUIfdqeuFS1q879h9c5WQyqngImEqUCsrcng1-PBFLl7-JGrBYiJYpx7XEPwlcGcEh7kQ8WicFpZY7gWrYEq9tc25J9VoRxu83umcPW7BZypDq21h2cn6N9u8Xb7Kod3mnMnTsypMQOeosoM9AstdiHMRaPf6dOxXgkOLjPgISSealTrZFdejasP-2-rtUSB7fTF8YC1C7bgnoJdZeyXPwRKGm5UbUFNIDoV-xL7-ZQWp7QWQ',
      averageRating: 3.4,
      ratingCount: 42,
      status: 'ACTIVE',
      createdAt: '2023-11-10'
    },
    {
      id: 'store-tech-bellevue',
      name: 'TechFlagship Bellevue',
      code: 'STR-1002',
      category: 'Enterprise Hardware',
      ownerId: 'user-admin-1',
      ownerName: 'Marcus Sterling',
      ownerEmail: 'admin@storerating.com',
      address: '100 Innovation Way, Suite 101, Bellevue, WA 98004',
      city: 'Bellevue, WA',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUWUp1QQL8-i-QdjLLuA9fV_nUnbeo1VAu2LsklTbVNpYBgU7pTEAUpYZrOnNoQptJUMbRQ2FrORvBWVdbYwj36ssF2ckMLRqGPSk1BgSKK67dKsCYlfANWcIIqqaKcQTenrTHASfKeZpLjYOq0Ctk__ygnF12MlM_NjlBbRQ7L0VrvE_zKwgvminRwqzyfH9NsDuuRrcEk8lR1KsuyYXh0n3XItKuB23KcAX-oREglb1yLqRF2CTi0w',
      averageRating: 4.8,
      ratingCount: 92,
      status: 'ACTIVE',
      createdAt: '2023-05-01'
    }
  ]);

  // Ratings List
  readonly ratings = signal<StoreRating[]>([
    {
      id: 'rat-101',
      storeId: 'store-quickbite',
      userId: 'user-shopper-1',
      userName: 'Jennifer Miller',
      userEmail: 'john.doe@example.com',
      rating: 5,
      feedback: 'Excellent service, super fresh inventory and contactless digital payment was instant!',
      createdAt: '2024-10-14 09:22',
      verifiedShopper: true
    },
    {
      id: 'rat-102',
      storeId: 'store-quickbite',
      userId: 'user-shopper-4',
      userName: 'Ananya Deshmukh',
      userEmail: 'ananya.d@maharashtra.in',
      rating: 5,
      feedback: 'Always spotless, great bakery section, and staff is remarkably courteous.',
      createdAt: '2024-10-18 14:15',
      verifiedShopper: true
    },
    {
      id: 'rat-103',
      storeId: 'store-quickbite',
      userId: 'user-shopper-5',
      userName: 'Vikram Malhotra',
      userEmail: 'vikram.malhotra@zenith.org',
      rating: 4,
      feedback: 'Good selection of local and organic items. Can get crowded during peak hours.',
      createdAt: '2024-10-21 17:40',
      verifiedShopper: true
    },
    {
      id: 'rat-104',
      storeId: 'store-quickbite',
      userId: 'user-shopper-2',
      userName: 'David Kim',
      userEmail: 'david.kim@techreview.io',
      rating: 5,
      feedback: 'Rapid automated checkouts make shopping here a breeze.',
      createdAt: '2024-10-24 11:05',
      verifiedShopper: true
    },
    {
      id: 'rat-105',
      storeId: 'store-quickbite',
      userId: 'user-shopper-3',
      userName: 'Sarah Jenkins',
      userEmail: 'sarah.j@consumerpulse.org',
      rating: 3,
      feedback: 'Decent collection, but parking spots on FC Road were limited on Saturday.',
      createdAt: '2024-10-26 19:12',
      verifiedShopper: true
    },
    {
      id: 'rat-201',
      storeId: 'store-aura-bakery',
      userId: 'user-shopper-1',
      userName: 'Jennifer Miller',
      userEmail: 'john.doe@example.com',
      rating: 4,
      feedback: 'World-class sourdough loafs and almond croissants. The queue moves well.',
      createdAt: '2024-10-12 08:30',
      verifiedShopper: true
    },
    {
      id: 'rat-202',
      storeId: 'store-aura-bakery',
      userId: 'user-shopper-2',
      userName: 'David Kim',
      userEmail: 'david.kim@techreview.io',
      rating: 5,
      feedback: 'Best artisanal espresso and pastries in Pike Place. Absolute 5-star experience!',
      createdAt: '2024-10-15 10:15',
      verifiedShopper: true
    },
    {
      id: 'rat-301',
      storeId: 'store-greenline',
      userId: 'user-shopper-3',
      userName: 'Sarah Jenkins',
      userEmail: 'sarah.j@consumerpulse.org',
      rating: 3,
      feedback: 'Good prices on pantry staples, but fresh produce section needed restocking.',
      createdAt: '2024-10-20 16:45',
      verifiedShopper: true
    },
    {
      id: 'rat-401',
      storeId: 'store-tech-bellevue',
      userId: 'user-shopper-2',
      userName: 'David Kim',
      userEmail: 'david.kim@techreview.io',
      rating: 5,
      feedback: 'Top tier staff knowledge and fast pickup counter for enterprise workstations.',
      createdAt: '2024-10-22 13:10',
      verifiedShopper: true
    }
  ]);

  // Telemetry & Activity events
  readonly events = signal<PlatformEvent[]>([
    {
      id: 'evt-1',
      type: 'RATING_SUBMITTED',
      title: 'Rating Evaluated & Published',
      description: 'QuickBite Mart received 5.0 ★ from verified shopper Jennifer Miller',
      timestamp: '4 minutes ago',
      badge: '5.0 ★ Verified'
    },
    {
      id: 'evt-2',
      type: 'STORE_ONBOARDED',
      title: 'New Store Onboarding',
      description: 'Urban Tech Flagship passed cryptographic TLS audit and GPS geofence verification',
      timestamp: '32 minutes ago',
      badge: 'STR-9041'
    },
    {
      id: 'evt-3',
      type: 'USER_REGISTERED',
      title: 'New User Registration',
      description: 'Jennifer Miller assigned role NORMAL_USER via verified OAuth authentication',
      timestamp: '2 hours ago',
      badge: 'NORMAL_USER'
    },
    {
      id: 'evt-4',
      type: 'PRIVILEGE_UPDATED',
      title: 'Admin Privilege Assigned',
      description: 'Role escalation confirmed for cluster administrator Marcus Sterling',
      timestamp: '6 hours ago',
      badge: 'IAM Level 3'
    }
  ]);

  // Toast Notification System
  readonly toasts = signal<ToastMessage[]>([]);

  showToast(type: 'success' | 'info' | 'error' | 'warning', title: string, message: string) {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    this.toasts.update(current => [...current, { id, type, title, message }]);
    setTimeout(() => {
      this.removeToast(id);
    }, 4500);
  }

  removeToast(id: string) {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }

  // Role simulation & Presets switcher
  setSimulationRole(role: UserRole) {
    const allUsers = this.users();
    let target = allUsers.find(u => u.role === role);
    if (!target) {
      if (role === 'ADMIN') {
        target = {
          id: 'user-admin-1',
          name: 'Marcus Sterling',
          email: 'admin@storerating.com',
          address: '100 Innovation Way, Suite 400, Bellevue, WA 98004',
          role: 'ADMIN',
          twoFactorEnabled: true,
          createdAt: '2023-01-15'
        };
      } else if (role === 'STORE_OWNER') {
        target = {
          id: 'user-owner-1',
          name: 'Rajesh Patil',
          email: 'owner@abcstore.com',
          address: '42 Deccan Gymkhana, FC Road, Pune, Maharashtra 411004',
          role: 'STORE_OWNER',
          storeId: 'store-quickbite',
          storeName: 'QuickBite Mart',
          twoFactorEnabled: true,
          createdAt: '2023-06-20'
        };
      } else {
        target = {
          id: 'user-shopper-1',
          name: 'Jennifer Miller',
          email: 'john.doe@example.com',
          address: '742 Evergreen Terrace, Springfield, OR 97477',
          role: 'USER',
          twoFactorEnabled: true,
          createdAt: '2024-01-10'
        };
      }
    }
    this.currentUser.set(target);
    this.showToast('info', 'Perspective Switched', `Switched active session view to ${role} (${target.name})`);
  }

  // Switch specific user directly
  setCurrentUser(user: User) {
    this.currentUser.set(user);
    this.showToast('info', 'Active User Switched', `Active session now set to ${user.name} (${user.role})`);
  }

  // Add a user
  addUser(userData: Omit<User, 'id' | 'createdAt'>) {
    const newUser: User = {
      ...userData,
      id: 'user-' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.users.update(current => [newUser, ...current]);
    this.events.update(cur => [
      {
        id: 'evt-' + Date.now(),
        type: 'USER_REGISTERED',
        title: 'New User Registration',
        description: `${newUser.name} created account with role ${newUser.role}`,
        timestamp: 'Just now',
        badge: newUser.role
      },
      ...cur
    ]);
    this.showToast('success', 'User Created', `Successfully provisioned ${newUser.name} as ${newUser.role}`);
    return newUser;
  }

  // Add a store
  addStore(storeData: {
    name: string;
    category: string;
    ownerId: string;
    address: string;
    city: string;
    imageUrl?: string;
  }) {
    const owner = this.users().find(u => u.id === storeData.ownerId);
    const newStore: Store = {
      id: 'store-' + Math.random().toString(36).substring(2, 9),
      name: storeData.name,
      code: 'STR-' + Math.floor(1000 + Math.random() * 9000),
      category: storeData.category || 'Retail Storefront',
      ownerId: storeData.ownerId,
      ownerName: owner?.name || 'Assigned Store Owner',
      ownerEmail: owner?.email || 'owner@storepulse.io',
      address: storeData.address,
      city: storeData.city,
      imageUrl: storeData.imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGQDAWrTXQ4F7ktX4vqqOpC7cuTGtfKsesiLbZRnrKNHx3UIGjAzljPGJ8bfF7ATqxCZonDJK-VO4-kwBbUamJJde7dLy7EVeNZ71NQLdLwyi8ikeg_1Bgr1wiwZ6nyYmyxFtkX0BJY5N3Eo4SVx6fevms4OWLVyy_LTqhU_c3QJMG0Ss_1NhI2IT7UGKUpoRGeYIBT8dVXdhYF-mEDBolIxxE5xmv26gZ_9lxCJikMgoyBIBHQ00Rfg',
      averageRating: 0,
      ratingCount: 0,
      status: 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0]
    };

    this.stores.update(cur => [newStore, ...cur]);
    this.events.update(cur => [
      {
        id: 'evt-' + Date.now(),
        type: 'STORE_ONBOARDED',
        title: 'New Store Onboarding',
        description: `${newStore.name} registered under ${newStore.ownerName}`,
        timestamp: 'Just now',
        badge: newStore.code
      },
      ...cur
    ]);
    this.showToast('success', 'Store Onboarded', `Added ${newStore.name} to the active store registry.`);
    return newStore;
  }

  // Submit or update a user rating for a store
  submitRating(storeId: string, ratingValue: number, feedback = '') {
    const user = this.currentUser();
    const existing = this.ratings().find(r => r.storeId === storeId && r.userId === user.id);
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (existing) {
      this.ratings.update(cur =>
        cur.map(r =>
          r.id === existing.id
            ? { ...r, rating: ratingValue, feedback, updatedAt: timeStr }
            : r
        )
      );
      this.recalculateStoreScore(storeId);
      this.showToast('success', 'Rating Updated', `Updated your evaluation to ${ratingValue}.0 ★ with saved feedback.`);
    } else {
      const newRating: StoreRating = {
        id: 'rat-' + Math.random().toString(36).substring(2, 9),
        storeId,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        rating: ratingValue,
        feedback,
        createdAt: timeStr,
        verifiedShopper: true
      };
      this.ratings.update(cur => [newRating, ...cur]);
      this.recalculateStoreScore(storeId);
      this.showToast('success', 'Rating Ingested', `Your ${ratingValue}.0 ★ rating was ingested and published.`);
    }

    const store = this.stores().find(s => s.id === storeId);
    this.events.update(cur => [
      {
        id: 'evt-' + Date.now(),
        type: 'RATING_SUBMITTED',
        title: 'Rating Evaluated & Published',
        description: `${store?.name || 'Store'} received ${ratingValue}.0 ★ from ${user.name}`,
        timestamp: 'Just now',
        badge: `${ratingValue}.0 ★`
      },
      ...cur
    ]);
  }

  private recalculateStoreScore(storeId: string) {
    const storeRatings = this.ratings().filter(r => r.storeId === storeId);
    if (storeRatings.length === 0) return;
    const sum = storeRatings.reduce((acc, r) => acc + r.rating, 0);
    const avg = Number((sum / storeRatings.length).toFixed(1));

    this.stores.update(cur =>
      cur.map(s => (s.id === storeId ? { ...s, averageRating: avg, ratingCount: storeRatings.length } : s))
    );
  }

  // Get user's rating for specific store
  getUserRatingForStore(storeId: string): StoreRating | undefined {
    return this.ratings().find(r => r.storeId === storeId && r.userId === this.currentUser().id);
  }

  // Owner store lookup
  getOwnerStore(): Store | undefined {
    const current = this.currentUser();
    if (current.storeId) {
      return this.stores().find(s => s.id === current.storeId);
    }
    return this.stores().find(s => s.ownerId === current.id || s.ownerEmail === current.email) || this.stores()[0];
  }

  // Export CSV helper
  exportRatingsCsv(storeId?: string) {
    let dataset = this.ratings();
    if (storeId) {
      dataset = dataset.filter(r => r.storeId === storeId);
    }
    const headers = 'Rating ID,Store ID,User Name,User Email,Rating Score,Feedback,Verified,Date\n';
    const rows = dataset.map(r =>
      `"${r.id}","${r.storeId}","${r.userName}","${r.userEmail}",${r.rating},"${(r.feedback || '').replace(/"/g, '""')}","${r.verifiedShopper}","${r.createdAt}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `StorePulse_Ratings_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast('info', 'Export Completed', `Generated CSV report with ${dataset.length} rating records.`);
  }

  exportUsersCsv() {
    const headers = 'User ID,Full Name,Email Address,Assigned Role,Address,TwoFactorEnabled,Created Date\n';
    const rows = this.users().map(u =>
      `"${u.id}","${u.name}","${u.email}","${u.role}","${(u.address || '').replace(/"/g, '""')}",${u.twoFactorEnabled},"${u.createdAt}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `StorePulse_Users_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast('info', 'Export Completed', `Generated CSV user directory with ${this.users().length} records.`);
  }
}
