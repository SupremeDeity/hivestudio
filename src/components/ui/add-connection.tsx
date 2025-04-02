import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "./button";
import { Plus } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import Database from "@tauri-apps/plugin-sql";
import { toast } from "sonner";
import { DatabaseProfile, useAppContext } from "@/context/AppContext";
import { getConnectionString } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  host: z.string().min(2).max(50),
  db_type: z.string(),
  default_database: z.string().min(2).max(50),
  user: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
  port: z.coerce.number().min(0).max(65535),
});

function AddConnection() {
  const { fetchProfiles, saveProfile } = useAppContext();
  const [connectionUrl, setConnectionUrl] = useState("");
  const [checking, setChecking] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      host: "",
      db_type: "postgres",
      default_database: "",
      name: "",
      password: "",
      user: "",
      port: 5432,
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) =>
      setConnectionUrl(form.formState.isValid ? getConnectionString(value) : "")
    );
    return () => subscription.unsubscribe();
  }, [form.watch]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await saveProfile(values);
      await fetchProfiles();
    } catch (error) {
      toast("Error" + error);
    }
  }

  const testConnection = async () => {
    setChecking(true);
    try {
      const db = await Database.load(connectionUrl);
      await db.execute("SELECT 1"); // Simple query to test the connection
      toast("Connection good!");
    } catch (error: any) {
      toast("Connection failed: " + error);
    }
    setChecking(false);
  };

  

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex-grow" size="sm">
          <Plus />
          Add connection
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-y-scroll h-full">
        <DialogHeader>
          <DialogTitle>Add Connection</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="db_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Database Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a database type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="postgres">Postgres</SelectItem>
                      <SelectItem value="mysql">MySQL</SelectItem>
                      <SelectItem value="sqlite">SQLite</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <span className="w-full">
                <FormField
                  control={form.control}
                  name="host"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Host</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </span>
              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Port</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2">
              <span className="w-full">
                <FormField
                  control={form.control}
                  name="user"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </span>
              <FormField
                control={form.control}
                name="default_database"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Database</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Connection URL</FormLabel>
              <Input value={connectionUrl} className="text-wrap" />
            </FormItem>

            <DialogFooter>
              <Button
                type="button"
                disabled={!connectionUrl || checking}
                onClick={testConnection}
                variant="secondary"
              >
                Test Connection
              </Button>
              <DialogClose>
                <Button type="submit">Save</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddConnection;
