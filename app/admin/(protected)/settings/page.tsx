import { SettingsForm } from "@/components/admin/forms";
import { getSettings } from "@/lib/site";

export default function AdminSettingsPage() {
  const settings = getSettings();
  return (
    <>
      <div>
        <h1 className="font-head text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted">
          Edit the text shown across your site — it updates immediately.
        </p>
      </div>
      <SettingsForm settings={settings} />
    </>
  );
}
