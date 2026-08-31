'use client';

import { useEffect, useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { searchItems } from '@/lib/content';

export function SiteSearch() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const navigate = (href: string) => {
    setOpen(false);
    window.location.assign(href);
  };

  return (
    <>
      <button className="search-trigger" type="button" aria-label="검색 열기" onClick={() => setOpen(true)}>
        <span>SEARCH</span>
        <kbd>⌘ K</kbd>
      </button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="사이트 검색"
        description="글, 노트, 프로젝트를 검색합니다."
        className="search-dialog"
      >
        <CommandInput placeholder="검색어를 입력하세요…" className="search-input" />
        <CommandList className="search-list">
          <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
          <CommandGroup heading="FIELD NOTES">
            {searchItems.map((item) => (
              <CommandItem
                key={`${item.type}-${item.label}`}
                value={`${item.label} ${item.description} ${item.type}`}
                onSelect={() => navigate(item.href)}
                className="search-item"
              >
                <span className="search-type">{item.type}</span>
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
