import { useState, useEffect } from 'react';
import { Label } from '@radix-ui/react-label';
import { Card } from '../components/ui/card';
import DotPattern from '../components/ui/dot-pattern';
import { cn } from '../lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Pencil } from 'lucide-react';
import { Button } from './ui/button';
import api from '../lib/api';
import { toast } from '../hooks/use-toast';

function ProfileCard() {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...user });

    const userDetails = [
        ["User Name", user.name || "User", "name"],
        ["Location", user.location || "Unknown", "location"],
        ["Mobile Number", user.mobileNumber || "Unknown", "mobileNumber"],
        [user.type == "employee" ? "Job Title" : "Industry", user.sector || "Unknown", "sector"],
        ["Email", user.email || "Unknown", "email"],
    ];

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user));
    }, [user]);

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        let data, url;
        if (user.type == "employee") {
            url = "/employee/profile/"
            data = {
                employeeId: user.id,
                name: formData.name,
                mobileNumber: formData.mobileNumber,
                location: formData.location,
                jobTitle: formData.sector
            }
        } else {
            url = "/employer/profile/"
            data = {
                employerId: user.id,
                name: formData.name,
                mobileNumber: formData.mobileNumber,
                location: formData.location,
                industry: formData.sector
            }
        }
        try {
            const res = await api.put(url, data);
            if (!res.status) {
                toast({
                    title: "Status",
                    description: "Error Updating Profile"
                })
                return;
            }
            setUser(formData);
            toast({
                title: "Status",
                description: "Profile Updated Succesfully"
            })
            console.log(formData)
        } catch (error: any) {
            console.log(error)
            toast({
                title: "Status",
                description: "Error Updating Profile"
            })
        } finally {
            setIsEditing(false);
        }
    };

    return (
        <Card className='p-4 relative'>
            <button className='absolute top-4 right-4 text-gray-600 hover:text-black' onClick={() => setIsEditing(true)}>
                <Pencil size={20} />
            </button>
            <div className='flex flex-col sm:flex-row gap-8'>
                <div className='flex-none w-full sm:w-64'>
                    <div className='relative flex h-[250px] w-full items-center justify-center overflow-hidden rounded-lg border bg-background p-20 md:shadow-xl'>
                        <p className='z-10 whitespace-pre-wrap text-center text-3xl font-bold tracking-normal text-black dark:text-white'>{user.name || "User"}</p>
                        <DotPattern width={25} height={25} cx={1} cy={1} cr={1} className={cn('[mask-image:linear-gradient(to_bottom,transparent,white,transparent)]')} />
                    </div>
                </div>
                <div className='flex-1 flex flex-col gap-7'>
                    <h1 className='text-xl font-bold'>Profile</h1>
                    <div className='grid grid-cols-2 lg:grid-cols-3 gap-4'>
                        {
                            userDetails.map(([label, value], i) => (
                                <div className='flex flex-col gap-2' key={i}>
                                    <Label className='text-md font-semibold text-muted-foreground'>{label}</Label>
                                    <p className='text-md'>{value}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className='grid gap-4'>
                        {
                            userDetails.map(([label, _, key]) => {
                                if (label != "Email") {
                                    return (
                                        <div key={key} className='flex flex-col gap-2'>
                                            <Label>{label}</Label>
                                            <Input type='text' name={key} value={formData[key] || ''} onChange={handleChange} />
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSave}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

export default ProfileCard;