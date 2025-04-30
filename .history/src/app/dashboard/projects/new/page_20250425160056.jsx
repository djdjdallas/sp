import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function NewProjectPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/dashboard/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create New Project</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Fill out the information below to create your new side project
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Project Name
            </label>
            <Input id="name" placeholder="My Awesome Project" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              placeholder="Briefly describe what your project does and why you're building it"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="stage" className="text-sm font-medium">
              Project Stage
            </label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="idea">Idea</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="mvp">MVP</SelectItem>
                <SelectItem value="launched">Launched</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="domain" className="text-sm font-medium">
                Domain Name (optional)
              </label>
              <Input id="domain" placeholder="myproject.com" />
            </div>

            <div className="space-y-2">
              <label htmlFor="repo" className="text-sm font-medium">
                Repository URL (optional)
              </label>
              <Input id="repo" placeholder="https://github.com/username/repo" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="live" className="text-sm font-medium">
              Live URL (optional)
            </label>
            <Input id="live" placeholder="https://myproject.com" />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="public" />
            <label htmlFor="public" className="text-sm font-medium">
              Make this project public
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="sale" />
            <label htmlFor="sale" className="text-sm font-medium">
              This project is for sale
            </label>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-4">
          <Button variant="outline" asChild>
            <Link href="/dashboard/projects">Cancel</Link>
          </Button>
          <Button>Create Project</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
