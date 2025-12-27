# Plangrove Components

## UI Primitives (`components/ui/`)

All based on Radix UI, styled with Plangrove's "Greenhouse Warmth" theme.

### Button
```tsx
import { Button } from "@/components/ui/button";

// Variants
<Button variant="primary">Water Plant</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">Edit</Button>
<Button variant="accent">Add Plant</Button>
<Button variant="water">Water Now</Button>
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>

// Loading state
<Button loading>Saving...</Button>
```

### Card
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

<Card variant="default">...</Card>      // Standard card
<Card variant="elevated">...</Card>     // More shadow
<Card variant="interactive">...</Card>  // Hover effects
```

### Input
```tsx
import { Input, Label, Textarea } from "@/components/ui/input";

<Label required>Plant Name</Label>
<Input placeholder="Enter name" error={hasError} />
<Textarea placeholder="Care notes..." />
```

### Dialog
```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <Button>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Select
```tsx
import { Select, SelectItem, SelectGroup, SelectLabel } from "@/components/ui/select";

<Select value={value} onValueChange={setValue} placeholder="Choose type">
  <SelectGroup>
    <SelectLabel>Common</SelectLabel>
    <SelectItem value="succulent">Succulent</SelectItem>
    <SelectItem value="tropical">Tropical</SelectItem>
  </SelectGroup>
</Select>
```

### Toast
```tsx
import { useToast, ToastProvider } from "@/components/ui/toast";

// In layout
<ToastProvider>{children}</ToastProvider>

// In component
const { addToast } = useToast();
addToast({ type: "success", title: "Plant watered!" });
addToast({ type: "error", title: "Failed", description: "Try again" });
```

### Progress
```tsx
import { Progress, WateringProgress } from "@/components/ui/progress";

<Progress value={75} variant="water" size="md" />
<WateringProgress daysUntilWatering={3} totalInterval={7} />
```

### Skeleton
```tsx
import { Skeleton, PlantCardSkeleton, GroveHeaderSkeleton } from "@/components/ui/skeleton";

<Skeleton className="h-4 w-32" />
<PlantCardSkeleton />  // Pre-built plant card loading state
<GroveHeaderSkeleton /> // Pre-built header loading state
```

### Motion
```tsx
import { FadeIn, SlideIn, ScaleIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";

<FadeIn>Content fades in</FadeIn>
<SlideIn direction="up">Slides up</SlideIn>
<ScaleIn>Scales in</ScaleIn>

<StaggerContainer>
  <StaggerItem>Item 1</StaggerItem>
  <StaggerItem>Item 2</StaggerItem>
</StaggerContainer>
```

### Confetti
```tsx
import { Confetti, useConfetti } from "@/components/ui/confetti";

const { trigger, isActive } = useConfetti();
<Confetti active={isActive} />
<Button onClick={trigger}>Celebrate!</Button>
```

---

## Grove Components (`components/grove/`)

### GroveHeader
Displays grove name with share button.
```tsx
import { GroveHeader } from "@/components/grove/grove-header";

<GroveHeader grove={grove} />
```

### GroveSettings
Dialog for editing grove name and deleting grove.
```tsx
import { GroveSettings } from "@/components/grove/grove-settings";

<GroveSettings grove={grove} open={open} onOpenChange={setOpen} />
```

### GroveStats
Statistics panel showing plant count, watering needs.
```tsx
import { GroveStats } from "@/components/grove/grove-stats";

<GroveStats plants={plants} />
```

### GroveHealth
Health dashboard showing overall grove status.
```tsx
import { GroveHealth } from "@/components/grove/grove-health";

<GroveHealth plants={plants} />
```

### GroveChangelog
Activity feed showing recent grove actions.
```tsx
import { GroveChangelog } from "@/components/grove/grove-changelog";

<GroveChangelog groveId={groveId} />
```

### ViewModeSelector
Toggle between gallery/list/compact views.
```tsx
import { ViewModeSelector } from "@/components/grove/view-mode-selector";

<ViewModeSelector value={viewMode} onChange={setViewMode} />
```

### SortSelector
Dropdown for sorting plants.
```tsx
import { SortSelector } from "@/components/grove/sort-selector";

<SortSelector value={sortBy} onChange={setSortBy} />
```

### WeatherWidget
Local weather display using Open-Meteo.
```tsx
import { WeatherWidget } from "@/components/grove/weather-widget";

<WeatherWidget />
```

### MyGroves
List of groves for signed-in users.
```tsx
import { MyGroves } from "@/components/grove/my-groves";

<MyGroves />
```

---

## Plant Components (`components/plant/`)

### PlantCard
Main plant display card with photo, name, status.
```tsx
import { PlantCard } from "@/components/plant/plant-card";

<PlantCard plant={plant} onWater={handleWater} onEdit={handleEdit} />
```

### PlantForm
Form for creating/editing plants.
```tsx
import { PlantForm } from "@/components/plant/plant-form";

<PlantForm
  groveId={groveId}
  plant={existingPlant} // optional for edit mode
  onSuccess={handleSuccess}
/>
```

### PlantGrid
Responsive grid layout for plant cards.
```tsx
import { PlantGrid } from "@/components/plant/plant-grid";

<PlantGrid>
  {plants.map(plant => <PlantCard key={plant.id} plant={plant} />)}
</PlantGrid>
```

### PlantViews
Alternative view modes (list, compact).
```tsx
import { PlantListView, PlantCompactView } from "@/components/plant/plant-views";

<PlantListView plants={plants} onWater={handleWater} />
<PlantCompactView plants={plants} onWater={handleWater} />
```

### PlantPhoto
Photo display with upload capability.
```tsx
import { PlantPhoto } from "@/components/plant/plant-photo";

<PlantPhoto
  src={photoUrl}
  onUpload={handleUpload}
  editable={true}
/>
```

### WaterButton
Animated water action button.
```tsx
import { WaterButton } from "@/components/plant/water-button";

<WaterButton
  plant={plant}
  onWater={handleWater}
  loading={isWatering}
/>
```

### WateringRecommendation
Smart watering suggestions based on plant type.
```tsx
import { WateringRecommendation } from "@/components/plant/watering-recommendation";

<WateringRecommendation plantType="succulent" />
```

### NameGenerator
AI-powered fun plant name suggestions.
```tsx
import { NameGenerator } from "@/components/plant/name-generator";

<NameGenerator onSelect={setPlantName} />
```

---

## Shared Components (`components/shared/`)

### Header
App header with logo and navigation.
```tsx
import { Header } from "@/components/shared/header";

<Header />
```

### EmptyState
Illustrated empty state for no plants/groves.
```tsx
import { EmptyState } from "@/components/shared/empty-state";

<EmptyState
  title="No plants yet"
  description="Add your first plant to get started"
  action={<Button>Add Plant</Button>}
/>
```

---

## Auth Components (`components/auth/`)

### AuthDialog
Sign in/up dialog with Supabase Auth.
```tsx
import { AuthDialog } from "@/components/auth/auth-dialog";

<AuthDialog open={open} onOpenChange={setOpen} />
```

---

## Custom Hooks (`hooks/`)

### useGrove
Fetch grove data.
```tsx
const { data: grove, isLoading, error } = useGrove(groveId);
```

### usePlants
Plant CRUD operations with TanStack Query.
```tsx
const {
  plants,
  isLoading,
  createPlant,
  updatePlant,
  deletePlant,
  waterPlant
} = usePlants(groveId);
```

### useAuth
Supabase authentication state.
```tsx
const { user, signIn, signOut, isLoading } = useAuth();
```

### usePhotoUpload
Upload photos to Supabase Storage.
```tsx
const { upload, isUploading, error } = usePhotoUpload();
const url = await upload(file, `plants/${plantId}`);
```

### useRealtime
Subscribe to Supabase realtime changes.
```tsx
useRealtime(groveId); // Auto-invalidates queries on changes
```

### useSound
Web Audio synthesized sound effects.
```tsx
const { playWater, playSuccess, playClick } = useSound();
```

### useViewMode
Persist view mode preference.
```tsx
const [viewMode, setViewMode] = useViewMode(); // 'gallery' | 'list' | 'compact'
```

### useSort
Persist sort preference.
```tsx
const [sortBy, setSortBy] = useSort(); // 'urgency' | 'name' | 'date' | 'type'
```

### useActivities
Fetch grove activity feed.
```tsx
const { activities, isLoading } = useActivities(groveId);
```

### useMyGroves
Fetch groves for signed-in user.
```tsx
const { groves, isLoading } = useMyGroves();
```

### useOnboarding
Onboarding flow state.
```tsx
const { showOnboarding, completeOnboarding } = useOnboarding();
```
