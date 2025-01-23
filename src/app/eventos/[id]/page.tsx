import Tables from "@/components/Tables";

type EventPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const EventPage = async ({ params }: EventPageProps) => {
  const { id } = await params;
  return (
    <Tables eventId={parseInt(id)} />
  );
};

export default EventPage;