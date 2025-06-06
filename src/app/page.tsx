
import PageHeader from '@/components/PageHeader';
import ResumeEditor from '@/components/resume/ResumeEditor';
import ResumePreview from '@/components/resume/ResumePreview';
import ResumeToolbar from '@/components/resume/ResumeToolbar';
import { ResumeProvider } from '@/contexts/ResumeContext';

export default function Home() {
  return (
    <ResumeProvider>
      <div className="flex flex-col min-h-screen bg-background print:bg-transparent">
        <PageHeader />
        <main className="flex-grow container mx-auto px-4 py-6 print:p-0 print:m-0 print:max-w-none">
          <ResumeToolbar />
          <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)] lg:h-[calc(100vh-220px)] no-print">
            <div className="lg:w-1/2 h-full">
              <ResumeEditor />
            </div>
            <div className="lg:w-1/2 h-full">
              <ResumePreview />
            </div>
          </div>
          {/* Hidden preview for printing, to ensure only preview prints and is correctly formatted */}
          <div className="hidden print:block">
             <ResumePreview />
          </div>
        </main>
      </div>
    </ResumeProvider>
  );
}
