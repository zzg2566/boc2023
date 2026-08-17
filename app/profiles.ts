export type YouthProfile = {
  slot: number;
  name: string;
  department: string;
  role: string;
  image: string;
  imageLayout: "landscape" | "portrait";
  imagePosition: string;
  intro: string;
  reflection: string;
  keyword: string;
};

export const youthProfiles: YouthProfile[] = Array.from({ length: 10 }, (_, index) => ({
  slot: index + 1,
  name: `青年员工 ${String(index + 1).padStart(2, "0")}`,
  department: "所属机构待发布",
  role: "岗位信息待发布",
  image: "",
  imageLayout: "portrait",
  imagePosition: "50% 50%",
  intro: "员工自我介绍资料待发布，敬请期待。",
  reflection: "清廉与自身岗位相结合的感悟资料待发布，敬请期待。",
  keyword: "待发布",
}));
