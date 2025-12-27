# Plangrove Components

## UI Primitives (`components/ui/`)

All based on Base UI, styled with Plangrove theme.

### Button
```tsx
import { Button } from "@/components/ui/button";

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

---

## Grove Components (`components/grove/`)

TODO: Document after implementation

---

## Plant Components (`components/plant/`)

TODO: Document after implementation

---

## Shared Components (`components/shared/`)

TODO: Document after implementation
