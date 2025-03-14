import { useState } from "react";
import { SideBar } from "@/components/ui/side-bar";
import { TabUserInfo } from "@/components/ui/UserInformation/tab-user-info";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Icons } from "@/components/ui/icons";
import { AlertMessage } from "@/components/ui/alert-message";
import BannerImage from "@/assets/banner-user-info.png";

const messages = [
  {
    avatar:
      "https://s3-alpha-sig.figma.com/img/b716/471e/a92dba5e34fe4ed85bd7c5f535acdaae?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LjxeFExG2mfQsIC1PhfgwD5sI1KwkgcdwdyUS5AyHkUVuwcJf1wR0ZiKF7RZrM0i8GSlA7aHsoF51XhpRQLxR4qVXSw6UnYprvVtc7RNpJffWnq1ukN~P7L77ZIPtjU6181DFElG8PGlTyFsLtC0TD24WIb-y7s7EIcnJrVTSDRyotmNCUq-j0qSMuU1rOM301xCYXHB3Ul70GKtqsgBKK8x79HKBZgu-laGa4Oy7rfMzDnlbjS2pO6EwNUu~wFvwhBiGnMSUcfFZeD4txGpwBhJCUDT8epFoEW82g1cYS81ClzjFuMme3-BsB9QFjlEHrquHOeBoH-A9zON9uXx4g__",
    name: "Iris Paul",
    message: "How are you?",
    time: "Now",
  },
  {
    avatar:
      "https://s3-alpha-sig.figma.com/img/77c6/8849/96c44a460b55a989d90970fc2b0d81ac?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=iNBXCAYM3XkbLwPPyDFsTOF1VUQ0bDb9tl-CwAtztbj1ZjtN2hARIoDC2VTA~txeqLZZ7WjmCJ-3Ecc6WY1lMMz2762duRsHiNhuSpSAcgpx5YCi070aaug2lmT2xEEizj1zIJYJZrh~fs2fc8AjHjM~Dtg2d4AzCOtMakm02pw~6VIajB6AlFxd4M9l-esyKuKy65lQKwG0w~mgAvsScnIry7uMWeC923sSRbV4RMUY7mfHkG3kr6rcFeOq2jmEhL4dAwyHri0ALLzVRe3brQ5o7M3f2SVquTzqRZtwTSedEjUg55O5M-Ka7p68--Q~DsX6yKZWbk00uWVqFaWjxA__",
    name: "Jone Nguyen",
    message: "How are you?",
    time: "2 mins",
  },
  {
    avatar:
      "https://s3-alpha-sig.figma.com/img/b3c2/3d22/9e7189a7eb428bd40284e032a6a646cc?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=qeF61cmLHi1NPEez5ZCWxrLsDss5xAGHt44FH3cPc7oQ7s86nIJayB064zDnzpKYCACqeOGGjVO5VjCOWtWm3fbpjw~hGaYG~ebUaTfu597TWCIiEvJ99gdk5F2Ig~zirHOUZFvCEAorIZhiX0JRJ-rOUnJqOOWX7fzzorNBpHis2wHEWU6zfdBdbeBQ0cQrH4OB6K02bMK4cHfCkM2t3foddVeShTHUv9U2Zt3~A1jSbkF4VzAs0QXoCnrUF4RP0WIYaetUZfLZyFWL9uOq-McF12Xj~Vj4Hrkpy6dxfeZnxwLwD52tN8dz7gIdRflVlN6P26cxdAD50byl2XUr2A__",
    name: "Aurora Bonita",
    message: "How are you?",
    time: "20 mins",
  },
  {
    avatar:
      "https://s3-alpha-sig.figma.com/img/4b44/1d65/e43e4a32db699d94c4bada7aa2ccff06?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LC4Lf-~lXiy7cXb7W7bD7gMkfkKG-MuT1w9BHPIT8MHna451KqaiuFaI4a23dJQ5CFyzf~P8yG7ti1rf02Gr9rEJ9J1SKuRUvRkrngZfD-YCPsydqKLarHXUglcV1-it82Q-Tn1-lKMOBTOnWIfBwUlsv44X8XdtuXLdkbUAG5wDOsmGyRde4i0CC6ZEw7TnIIPmM75HI9tE7GTRy4jjWwhf23ixSZF39XVOL-yoUSCzZyU--khY6RXRrznHqXD6lt3REZY8WXjrjzG01RmlftfhMhJQ3UkkWYanFEnX-S~d1tbMMpNc3A20DYYddm5ENQuaA-NMR~y~mFKd7Xak6g__",
    name: "Tom Athony",
    message: "How are you?",
    time: "4 hours",
  },
  {
    avatar:
      "https://s3-alpha-sig.figma.com/img/0dca/d322/bd3b28a9327f195eb0ce730500f0d0da?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=bQj558EhPLvR54rq0b2PL0gPgTXPT19sHatuctR86Gn3FfMyB3lzgRTgxMdL77chQqFQPJ3sx4cWwEXLU5aYsS7S8BZUhbdtL5oaxwYPaZ2CRJH7TVyWElUBQenup5CcNzIlLxgsg6MMnDsF0xWYt3kYGayvLEYTTLolGfsVTooWyxuCiuY-yqwIty5yV88U7cdCUrkYTSptvCP7H3Z-RpanK5nFfbepVkyVs~fZzICaYORaMItemepGNBfanrzYXn5Y6-XdcYyi-OVi17uFT559yksnRvi4dQ0gsFjNphLXbS0Jz4IsBEFqxhEdgnzOjkWtpc0nMaZr92ke9dju~Q__",
    name: "Liam Hemsworth",
    message: "How are you?",
    time: "6 hours",
  },
  {
    avatar:
      "https://s3-alpha-sig.figma.com/img/05a9/c731/be92cab5736e28f18b4b2ca1d65fd213?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Etqp8TCP2Bt6L7~3qfgv1ckwPVILUO88ZAO3IJkqAcqyZRRIi9YFFxxoNr-~SFaVN7vNI1XrKBB8iH0v-0S5mHoC2QngbIQzNPM-3UkMYGmU1ZYt9xGINd7tldlqJVniAYXv-0PlynrhWrSKgTJe~J~Wiwo-wy5YDp-V63iI7u00cOSeZTxGdZwx1SNN7a8MFK6OUL0v~OBB-e498DbrtsDXL8BOinhAToKDp71dRgj-eWIG4QCWeV~P3GRx2aYiCDtYvU3DtlCtPYL2ceY35KmSOQXJ77BWSMVYUplcu8OgNsWbOsaCWS95Ln8LuOq6FqC7X94exi8ZtupWhJmHVg__",
    name: "Daria Julli",
    message: "How are you?",
    time: "21 hours",
  },
  {
    avatar:
      "https://s3-alpha-sig.figma.com/img/4f96/6c32/0b9a00911f35a7ae254f6846bb1f4021?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=RZT9n-2xU0OV8osbPbAYdd9QxuYH93wC6VE9dRymL0hPPUZ2RrulkhHwVDP9WDfRJ7I2sgUnBX5gtvWi1gXCuM~DJ-9iwXYx9E3IFuWp-zhH14Bm6--o6Vj3ebU9u1GmG0h0Q445KGb9rFAwuGD3N-VDabqhIYv0xy-hmyRzZxfaX9fTzNtctDMCis-~0QNLwxuVBFTUx9TjaCznyHzRvqhq1NHtvhE~H488WFMLDxbFJpy52EZn7fK7ZCS4x98dGgsHTYzwuqReluqWUwLKcPQl0RR-ShqPub-vYnjN-NxMmsVHzoAzPD1Pc4Eu1TYzBAWTzGgchaiYyFXO-FEWuA__",
    name: "Monica William",
    message: "How are you?",
    time: "Yesterday",
  },
];

const groups = [
  {
    avatar:
      "https://cdn.sanity.io/images/599r6htc/regionalized/5094051dac77593d0f0978bdcbabaf79e5bb855c-1080x1080.png?w=540&h=540&q=75&fit=max&auto=format",
    name: "Design Team",
    message: "New project discussion",
    time: "5 mins",
  },
  {
    avatar:
      "https://cdn.bap-software.net/2024/01/03211643/How-is-AI-applied-to-Java-programming-e1704266486769.jpg",
    name: "Development Team",
    message: "Sprint planning",
    time: "1 hour",
  },
  {
    avatar:
      "https://osd.vn/media/data/news/2022/06/seo-la-gi-seo-web-la-gi-ban-hieu-the-nao-ve-seo-2.jpg",
    name: "Marketing Team",
    message: "Campaign updates",
    time: "3 hours",
  },
];

const requests = [
  {
    avatar:
      "https://s3-alpha-sig.figma.com/img/0dca/d322/bd3b28a9327f195eb0ce730500f0d0da?Expires=1739750400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=A85Yi8I9~KWqyXmqyfuBGHshdKrK8tThkb0O2PFT9r3RfGbUHEKPrNooEK6K1kWm3XxH7wkD8ow8hQJhCOW6~-NlzRvt~mwwd69qJg9jePW~hkCxxmmqJhQEX4AmeuMsXxQra5FhE15ZX0dtlvCN8y687T9BjrijhDOIr-RHOrSNsIbJ017SzZabBsEV0tmCsUfJtNheeabH9IO6LPD1aiMV-TnG0Y0S9Sf-Uw5VuS8la3pQx--qHVu9kiJpkNvJVOJs2Zfhkdtw69uR2EH80RhL7KMohgNOuaaoxeRDGDuJaH4~oTzvt9pfY~HnQf8gO37oWR2kQZ2ZdxsWMr28YA__",
    name: "John Doe",
    message: "Hi, I'd like to connect!",
    time: "2 hours ago",
  },
  {
    avatar:
      "https://s3-alpha-sig.figma.com/img/77c6/8849/96c44a460b55a989d90970fc2b0d81ac?Expires=1739750400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Sn~-U8HNJIM02fCZz~FQOkPOoJ9pPydiMV77hD380IEC1YwjFA1QIs7pEWfhHe4EtgawfJuVayY-7HUjLtmvR4XWFrWqjD6CS3pp3dN1iSyM2rMwbDKvIvPDOaQAg11Tq8AvuHHQ42CYYDNfURwydgalpaMO4oIaAPNGXIFE6wu9Ha61CqbS7IqOWqGMhJqtb1ufbzL0H52TaBsuvh2OWuOUm~xNP23299fP0rarWbC5yU0T2-n6kBJNzEEZBbP3hFuHFNo2ZDJeQgwsSuXBj6bJAULIC-jftzehDWpSQ1Qz-p8SPEShQ3eMtMGDJx9rwtvjSah24tv1VvZCOOzRVA__",
    name: "Jane Smith",
    message: "Hello, can we chat?",
    time: "1 day ago",
  },
];

const availableHobbies = [
  {
    value: "Singing",
    label: "Singing",
    icon: Icons.mic,
  },
  {
    value: "Dancing",
    label: "Dancing",
    icon: Icons.partyPopper,
  },
  {
    value: "Reading",
    label: "Reading",
    icon: Icons.book,
  },
  {
    value: "Writing",
    label: "Writing",
    icon: Icons.notebookPen,
  },
  {
    value: "Painting",
    label: "Painting",
    icon: Icons.palette,
  },
  {
    value: "Photography",
    label: "Photography",
    icon: Icons.camera,
  },
  {
    value: "Cooking",
    label: "Cooking",
    icon: Icons.chefHat,
  },
  {
    value: "Gardening",
    label: "Gardening",
    icon: Icons.fence,
  },
  {
    value: "Traveling",
    label: "Traveling",
    icon: Icons.plane,
  },
  {
    value: "Sports",
    label: "Sports",
    icon: Icons.bike,
  },
];

export default function UserInformation() {
  const [activeTab, setActiveTab] = useState("information");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [userInfo, setUserInfo] = useState({
    firstName: "User",
    lastName: "Admin",
    dateOfBirth: "2003-02-25",
    gender: "Male",
    hobbies: ["Singing", "Dancing"],
  });

  const handleSubmitPassword = (e) => {
    e.preventDefault();

    if (!currentPassword) {
      AlertMessage({
        type: "error",
        message: "Please enter your current password",
      });
      return;
    }

    if (!newPassword) {
      AlertMessage({
        type: "error",
        message: "Please enter your new password",
      });
      return;
    }

    if (!confirmPassword) {
      AlertMessage({
        type: "error",
        message: "Please enter your confirm password",
      });
      return;
    }

    if (currentPassword !== "12345678") {
      AlertMessage({ type: "error", message: "Current password is incorrect" });
      return;
    }

    if (newPassword !== confirmPassword) {
      AlertMessage({
        type: "error",
        message: "Confirm password does not match",
      });
      return;
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      AlertMessage({
        type: "error",
        message:
          "Password must be at least 8 characters long, containing uppercase and lowercase letters and numbers",
      });
      return;
    }

    AlertMessage({ type: "success", message: "Password changed successfully" });
  };

  const handleSubmitInfo = (e) => {
    e.preventDefault();
    setIsEditing(false);

    const regexName = /^[A-Za-zÀ-ỹ\s]+$/;
    if (!userInfo.firstName) {
      AlertMessage({ type: "error", message: "Please enter your first name" });
      return;
    }

    if (!regexName.test(userInfo.firstName)) {
      AlertMessage({ type: "error", message: "First name must be characters" });
      return;
    }

    if (!userInfo.lastName) {
      AlertMessage({ type: "error", message: "Please enter your last name" });
      return;
    }

    if (!regexName.test(userInfo.lastName)) {
      AlertMessage({ type: "error", message: "Last name must be characters" });
      return;
    }

    // under 18
    if (
      new Date().getFullYear() - new Date(userInfo.dateOfBirth).getFullYear() <
      18
    ) {
      AlertMessage({ type: "error", message: "Age must be over 18" });
      return;
    }

    AlertMessage({
      type: "success",
      message: "Information updated successfully",
    });
  };

  return (
    <div className="flex w-full h-screen bg-gradient-to-b from-blue-50/50 to-white">
      <SideBar messages={messages} groups={groups} requests={requests} />

      {/* Main Content */}
      <div className="relative flex-1 p-3 bg-blue-100">
        {/* Banner Image */}
        <div
          className="w-full bg-center bg-cover h-72 rounded-3xl"
          style={{
            backgroundImage: `url(${BannerImage})`,
          }}
        />

        {/* Profile Content */}
        <div className="flex flex-row max-w-4xl px-8 mx-auto -mt-24 gap-x-5">
          {/* Profile Header */}
          <div className="p-6 mb-6 text-center bg-white shadow-sm rounded-3xl">
            <div className="flex flex-col items-center">
              <img
                src="https://s3-alpha-sig.figma.com/img/20a1/d517/ac424205661ad4fee696bc7f0dcf9d8e?Expires=1739750400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=aoH6zpyJ3XrNKTtX60RhnUjzWlJt1SRFL0aYWlWPwbpgvkP~kH0Cx1ODjG-dqq-FRG5Mc6VF94ib~lrcrcxnoCLR0y0mEeoN65hFqXGVLGF82cHPR0gnDmVe-k6r5JoXWjUJrQTSilXqvDHQuMTkih5-t2vm27yAodKXOmXdn14cDC3mIbSGOkoP2L1PFDN16RMNOHACx3R-3h-IAAhDuY-s6Lc3pq~RvJbBz-8gVneiQZ4gsXhojMOmYT~m-b0nhCapF1A4eYQq40Rauws2ftnJlEQ0~0MeDDYHRj0AO32wQbRgYXCMbHYXWPMPIR0nJNc7fIJMJBJNXc~VaF~oVw__"
                alt="User Admin"
                className="object-cover w-24 h-24 mb-4 border-4 border-white rounded-full"
              />
              <h1 className="mb-2 text-2xl font-semibold text-gray-900">
                User Admin
              </h1>
              <p className="mb-6 text-gray-600">⭐ Have a nice day! 🌊</p>

              {/* QR Code */}
              <div className="flex flex-col items-center">
                <img
                  src="https://s3-alpha-sig.figma.com/img/0374/d850/67166b3ba72139d99902439d7af64208?Expires=1739750400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=JZ7wxzMSGCy6FylTJdRL-bCaGmeVbzAGd1Zkxp5xu3cCaMUh3dsXDiSN-50xHNl7oBGUXkzk4Cb~FaAFqEV6oY-6LLkhNTiGbU8zf2DobPFipskQ4SH4lcYQXZe1RfPWE2CbPhzm35Ip6GH~HIGKgtuUWydCr6IhHzE6gKkJYIHSISRHUYtNhdy542PfUg9CUHVI5-WN9cfQMhbS7Mv4LL1~oI-7-vy8XUDa6xlwJcBdcyfbDOkAZZYcYcItr8HM48JGa1q3CspnIMkdnpFjR4ymtjQ5xDpWHzpAJoRLMDPxHlv2NHS4i4t8VWw8ZK~TVyGXAZcxW9d-4bSNsLlZaQ__"
                  alt="QR Code"
                  className="w-32 h-32 mb-2"
                />
                <p className="text-sm font-bold text-orange-500">
                  QR code helps people follow you quickly
                </p>
                <button className="p-2 mt-2 transition-colors bg-orange-100 border-none rounded-full hover:bg-orange-200">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="text-orange-400"
                  >
                    <path
                      d="M12 4v12m0 0l-4-4m4 4l4-4"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 16.8v.8a2.4 2.4 0 0 0 2.4 2.4h11.2a2.4 2.4 0 0 0 2.4-2.4v-.8"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs & Content */}
          <div className="flex-1 bg-white shadow-sm rounded-3xl">
            <div className="border-b">
              <div className="flex items-center justify-between pr-4">
                <TabUserInfo activeTab={activeTab} onTabChange={setActiveTab} />
                {activeTab === "information" && (
                  <Button
                    variant="ghost"
                    className="text-blue-600 bg-white hover:text-blue-700"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    Edit
                  </Button>
                )}
              </div>
            </div>

            <div className="p-6">
              {activeTab === "information" ? (
                <form onSubmit={handleSubmitInfo} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-1 text-sm font-medium text-left">
                        First name
                      </label>
                      <Input
                        value={userInfo.firstName}
                        onChange={(e) =>
                          setUserInfo({
                            ...userInfo,
                            firstName: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="bg-gray-50 text-regal-blue"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-left">
                        Last name
                      </label>
                      <Input
                        value={userInfo.lastName}
                        onChange={(e) =>
                          setUserInfo({ ...userInfo, lastName: e.target.value })
                        }
                        disabled={!isEditing}
                        className="bg-gray-50 text-regal-blue"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-left">
                        Date of Birth
                      </label>
                      <div className="relative">
                        <Input
                          type="date"
                          value={userInfo.dateOfBirth}
                          onChange={(e) =>
                            setUserInfo({
                              ...userInfo,
                              dateOfBirth: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="bg-gray-50 text-regal-blue"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-left">
                        Gender
                      </label>
                      <Select
                        value={userInfo.gender}
                        onValueChange={(value) =>
                          setUserInfo({ ...userInfo, gender: value })
                        }
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="bg-gray-50 text-regal-blue">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-left">
                      Your hobbies
                    </label>
                    <MultiSelect
                      disabled={!isEditing}
                      options={availableHobbies}
                      onValueChange={(value) =>
                        setUserInfo({ ...userInfo, hobbies: value })
                      }
                      defaultValue={userInfo.hobbies}
                      placeholder="Select options"
                      variant="inverted"
                      animation={2}
                      maxCount={3}
                    />
                  </div>
                  {isEditing && (
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        className="text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Save Changes
                      </Button>
                    </div>
                  )}
                </form>
              ) : (
                <div className="max-w-md mx-auto">
                  <h2 className="flex items-center justify-center gap-2 mb-6 text-xl font-semibold text-regal-blue">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="text-blue-600"
                    >
                      <rect
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                        ry="2"
                        strokeWidth="2"
                      />
                      <path d="M7 11V7a5 5 0 0110 0v4" strokeWidth="2" />
                    </svg>
                    Change password
                  </h2>

                  <form onSubmit={handleSubmitPassword} className="space-y-4">
                    <div>
                      <label className="block mb-1 text-sm font-bold text-left text-gray-700">
                        Current password
                      </label>
                      <Input
                        type="password"
                        name="currentPassword"
                        placeholder="Enter current password"
                        className="w-full bg-gray-100 rounded-full"
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-bold text-left text-gray-700">
                        New password
                      </label>
                      <Input
                        type="password"
                        name="newPassword"
                        placeholder="Enter new password"
                        className="w-full bg-gray-100 rounded-full"
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-bold text-left text-gray-700">
                        Confirm password
                      </label>
                      <Input
                        type="password"
                        name="confirmPassword"
                        placeholder="Enter confirm password"
                        className="w-full bg-gray-100 rounded-full"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Password must be at least 8 characters long, containing
                        uppercase and lowercase letters and numbers
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Save
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
