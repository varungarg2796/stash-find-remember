
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";

const Profile = () => {
  const { user, updateUserPreferences } = useAuth();
  const navigate = useNavigate();
  
  const [theme, setTheme] = useState<"light" | "dark">(
    user?.preferences?.theme || "light"
  );
  const [currency, setCurrency] = useState<string>(
    user?.preferences?.currency || "USD"
  );

  if (!user) {
    navigate("/");
    return null;
  }

  const handleSavePreferences = () => {
    updateUserPreferences({
      theme,
      currency,
    });
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-3xl font-bold">My Profile</h1>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <img 
            src={user.avatarUrl || "/placeholder.svg"} 
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Theme</label>
                <Select
                  value={theme}
                  onValueChange={(value: "light" | "dark") => setTheme(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Currency</label>
                <Select
                  value={currency}
                  onValueChange={(value) => setCurrency(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="JPY">JPY (¥)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button onClick={handleSavePreferences}>Save Preferences</Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
