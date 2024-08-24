import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { DataTable } from "@/components/custom/DataTable";
import { columns } from "@/components/courses/Columns";

const CoursesPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const specificUserId = 'user_2jwilhi4UHfVpPyD2U2wvNx5rmr'; 

  let courses;
  if (userId === specificUserId) {
    courses = await db.course.findMany({
      orderBy: {
        createdAt: "desc",
      },
      cacheStrategy: { swr: 60, ttl: 60 },
    });
  } else {
    courses = await db.course.findMany({
      where: {
        instructorId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      cacheStrategy: { swr: 60, ttl: 60 },
    });
  }

  return (
    <div className="px-6 py-4">
      <Link href="/instructor/create-course">
        <Button>Create New Course</Button>
      </Link>

      <div className="mt-5">
        <DataTable columns={columns} data={courses} />
      </div>
    </div>
  );
};

export default CoursesPage;