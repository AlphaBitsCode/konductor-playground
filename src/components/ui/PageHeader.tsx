"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export function PageHeader({ 
  title, 
  subtitle, 
  breadcrumbs = [], 
  actions 
}: PageHeaderProps) {
  const defaultBreadcrumbs: BreadcrumbItem[] = [
    { label: 'Office', href: '/office' },
    ...breadcrumbs
  ];

  return (
    <div className="sticky top-0 z-30 border-b-2 dark:border-slate-600 border-stone-300 dark:bg-slate-900/95 bg-stone-100/95 backdrop-blur-md shadow-lg">
      <div className="p-4">
        {/* Breadcrumb Navigation */}
        {defaultBreadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-1.5 mb-3 text-xs">
            <Home className="h-3 w-3 dark:text-slate-400 text-stone-600" />
            {defaultBreadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <ChevronRight className="h-3 w-3 dark:text-slate-400 text-stone-600" />
                )}
                {item.href ? (
                  <Link 
                    href={item.href}
                    className="dark:text-slate-300 text-stone-700 hover:dark:text-white hover:text-stone-900 transition-colors font-jersey text-xs"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="dark:text-white text-stone-900 font-jersey font-medium text-xs">
                    {item.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Compact Title and Actions Layout */}
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-4">
              <h1 className="font-press-start text-lg dark:text-white text-stone-900 tracking-wider uppercase">
                {title}
              </h1>
              {subtitle && (
                <p className="dark:text-slate-400 text-stone-600 font-jersey text-sm truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          {actions && (
            <div className="flex items-center space-x-2 ml-4">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PageHeader;