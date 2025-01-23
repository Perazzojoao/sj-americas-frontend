import PublicTableMapping from "@/components/PublicTableMapping";

type MapPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const MapPage = async ({ params }: MapPageProps) => {
  const { id } = await params;
  return (
    <PublicTableMapping eventId={parseInt(id)} />
  );
}

export default MapPage;