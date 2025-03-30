import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="relative z-10 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow">
              <i className="fas fa-feather-alt text-white"></i>
            </div>
            <h1 className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">BlogOutline</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
              <i className="far fa-question-circle mr-2"></i>
              <span className="hidden sm:inline">Help</span>
            </Button>
            
            <Button variant="outline" size="sm" className="flex items-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-4 h-4 mr-2" />
              <span>Connect Google</span>
            </Button>
            
            <Button variant="ghost" size="icon" className="rounded-full">
              <i className="fas fa-user-circle text-xl text-gray-600 dark:text-gray-300"></i>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
