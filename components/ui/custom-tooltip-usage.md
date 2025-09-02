# CustomTooltip Component Usage

The `CustomTooltip` component is a reusable tooltip that can be used throughout the application. It provides both hover and click functionality with consistent styling.

## Features

- **Hover and Click**: Shows tooltip on both hover and click
- **Toggle on Click**: Clicking the info button toggles the tooltip on/off
- **Consistent Styling**: Uses your brand colors (`--secondary-light` for background)
- **Customizable**: Accepts custom content and optional styling classes
- **Reusable**: Can be used for any field that needs additional information

## Usage

### Basic Usage
```tsx
import CustomTooltip from '@/components/ui/custom-tooltip';

<CustomTooltip content="Your tooltip text here" />
```

### With Custom Styling
```tsx
<CustomTooltip 
  content="Custom tooltip message"
  className="max-w-xs" // Custom tooltip styling
  buttonClassName="h-6 w-6" // Custom button styling
/>
```

## Examples

### Zip Code Field
```tsx
<div className="flex items-center gap-2">
  <Input name="zip_code" placeholder="Zip Code" />
  <CustomTooltip content="Enter zip code in format: XXXXX or XXXXX-XXXX" />
</div>
```

### Website Field
```tsx
<div className="flex items-center gap-2">
  <Input name="website" placeholder="Website" />
  <CustomTooltip content="Enter website URL (e.g., www.example.com or https://example.com)" />
</div>
```

### Phone Field
```tsx
<div className="flex items-center gap-2">
  <Input name="phone" placeholder="Phone" />
  <CustomTooltip content="Enter phone number in format: (555) 123-4567" />
</div>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string` | Required | The text to display in the tooltip |
| `className` | `string` | `""` | Additional CSS classes for the tooltip |
| `buttonClassName` | `string` | `""` | Additional CSS classes for the info button |

## Styling

The component uses your brand's CSS variables:
- Background: `--secondary-light` (light pink from logo)
- Border: `--secondary/30` (30% opacity of main pink)
- Text: `text-gray-700` (dark gray for readability)
- Arrow: Matches the background color

## Behavior

1. **Hover**: Tooltip appears when hovering over the info button
2. **Click**: Tooltip toggles on/off when clicking the info button
3. **Auto-hide**: Tooltip disappears when mouse leaves the button area
4. **Positioning**: Tooltip appears above the button with a small arrow pointer
