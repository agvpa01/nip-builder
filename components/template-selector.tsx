"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Beaker, Dumbbell, FlaskConical } from "lucide-react"

interface TemplateSelectorProps {
  onTemplateSelect: (template: string) => void
}

export function TemplateSelector({ onTemplateSelect }: TemplateSelectorProps) {
  const templates = [
    {
      id: "protein",
      name: "Protein Powder Template",
      description: "Complete nutritional panel with amino acid profile for protein supplements",
      icon: Dumbbell,
      features: [
        "Detailed nutritional information",
        "Complete amino acid profile",
        "Per serve and per 100g values",
        "Suitable for protein powders and similar products",
      ],
    },
    {
      id: "supplements",
      name: "Supplements Template",
      description: "Simplified nutritional panel for general supplements and vitamins",
      icon: Beaker,
      features: [
        "Basic nutritional information",
        "Per serve and per 100g values",
        "Servings per bottle format",
        "Ideal for capsules, tablets, and general supplements",
      ],
    },
    {
      id: "complex",
      name: "Complex Supplement Template",
      description: "Comprehensive panel with nutritional and compositional information for advanced supplements",
      icon: FlaskConical,
      features: [
        "Complete nutritional information",
        "Compositional information section",
        "Multiple active ingredients",
        "Ingredients list and consumption warnings",
      ],
    },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {templates.map((template) => {
        const IconComponent = template.icon
        return (
          <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <IconComponent className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">{template.name}</CardTitle>
              <CardDescription className="text-sm">{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {template.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button onClick={() => onTemplateSelect(template.id)} className="w-full">
                Select Template
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
