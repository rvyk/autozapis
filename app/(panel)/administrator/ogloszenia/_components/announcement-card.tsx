"use client";

import { Button } from "@/components/ui/button";
import { TARGET_LABELS, type Announcement } from "./ogloszenia-types";
import { formatAnnouncementDate } from "./ogloszenia-utils";

export function AnnouncementCard({
  post,
  pending,
  onEdit,
  onDelete,
}: {
  post: Announcement;
  pending: boolean;
  onEdit: (announcement: Announcement) => void;
  onDelete: (announcementId: string) => void;
}) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between border-b border-stone-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-stone-900">{post.title}</h3>
          <div className="mt-1 flex items-center gap-3 text-sm text-stone-500">
            <span className="font-medium text-stone-700">{post.authorName}</span>
            <span className="h-1 w-1 rounded-full bg-stone-300" />
            <span>{formatAnnouncementDate(post.createdAt)}</span>
            {post.updatedAt !== post.createdAt ? (
              <>
                <span className="h-1 w-1 rounded-full bg-stone-300" />
                <span className="text-xs">edytowano {formatAnnouncementDate(post.updatedAt)}</span>
              </>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">
            Odbiorcy: {TARGET_LABELS[post.target]}
          </span>
          <Button
            variant="secondary"
            size="sm"
            className="rounded-lg border-stone-200 px-3 py-1.5 text-xs hover:border-red-200 hover:bg-red-50 hover:text-red-700"
            onClick={() => onEdit(post)}
          >
            Edytuj
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="rounded-lg px-3 py-1.5 text-xs disabled:opacity-60"
            onClick={() => onDelete(post.id)}
            disabled={pending}
          >
            Usun
          </Button>
        </div>
      </div>

      <div className="pt-2 text-sm leading-relaxed text-stone-600">{post.content}</div>
    </article>
  );
}
