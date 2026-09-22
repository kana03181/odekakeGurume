import { FEATURE_ICON_MAP } from "@/app/_constants/featureIconMap";

  type Feature = {
    featureId: number;
    feature: {
      name: string;
      categoryId: number;
      category: {
        label: string;
      }
    };
  }

  type FeatureListProps = {
    features: Feature[];
    categoryId: number;
}


export const FeatureList = ({
  features, categoryId
}: FeatureListProps) => {
  const filteredFeatures = features.filter(
    (feature) => feature.feature.categoryId === categoryId
  );

  return (
    <>
      {filteredFeatures.map((feature) => {
        const icon = FEATURE_ICON_MAP[feature.featureId];

        return(
          <div key={feature.featureId} className="flex items-center justify-center gap-1.5 posts-bg-primary px-2.5 py-5.5 rounded-2xl">
            <div>
              {icon && <img className="w-3.5 h-4.5" src={icon} alt="" />}
            </div>
            <p className="text-primary text-sm font-medium">{feature.feature.name}</p>
          </div>
        )
      })}
    </>
  )
}
