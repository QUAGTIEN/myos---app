import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/editorial/SectionHeading';
import { Arrow } from '@/components/ui/Arrow';
import { solutions } from '@/content/solutions';

export function SolutionsOverview() {
  return <section id="nhu-cau" className="solutions-overview section-space" aria-labelledby="solutions-overview-title">
    <Container className="solutions-overview-layout">
      <SectionHeading id="solutions-overview-title" eyebrow="BẮT ĐẦU TỪ CÔNG VIỆC CỦA BẠN" title={["Từ nhu cầu công việc", "đến nhóm sản phẩm phù hợp."]} variant="process" description="Bạn có thể cần một mẫu nhãn mới, nguyên vật liệu để tự thực hiện hoặc một hạng mục được gia công, sản xuất theo yêu cầu. Chúng tôi kết hợp danh mục sản phẩm với các hình thức thực hiện để trao đổi phương án cho từng nhu cầu." />
      <nav className="solution-directory" aria-label="Các nhu cầu sử dụng">
        {solutions.map((solution, index) => <a href={`#${solution.slug}`} key={solution.slug}><span className="directory-number">0{index + 1}</span><span>{solution.label}</span><Arrow diagonal /></a>)}
      </nav>
    </Container>
  </section>;
}
