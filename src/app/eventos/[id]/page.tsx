import Tables from "@/components/Tables";

type EventPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const EventPage = async ({ params }: EventPageProps) => {
  const { id } = await params;
  return (
    <div className="px-3 sm:px-4 lg:px-5 lg:w-4/5 xl:w-4/6 mx-auto mb-8">
      <Tables eventId={parseInt(id)} />
    </div>
  );
};

export default EventPage;