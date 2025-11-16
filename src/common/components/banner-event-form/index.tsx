import { Button, Form, Input, Upload, message, Image } from 'antd';
import type { UploadFile } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import { useEffect, useState } from 'react';
import { StyledBannerForm } from './style';
import { BannerEvent } from '../../../apis/banners.api';
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

dayjs.extend(customParseFormat);
dayjs.extend(utc);

const BannerEventForm: React.FC<{
    banner: BannerEvent | null;
    handleSubmit: (formData: FormData, onSuccess: () => void) => void;
    isLoading: boolean;
}> = ({ banner, handleSubmit, isLoading }) => {
    const [form] = Form.useForm();
    const [file, setFile] = useState<File | null>(null);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (banner) {
            form.setFieldsValue({
                title: banner.title,
                description: banner.description,
                time: [dayjs(banner.startTime), dayjs(banner.endTime)],
            });
        }
    }, [banner, form]);

    const onFinish = (values: { title: string; description: string }) => {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);


        if (file) {
            formData.append('image', file);
        } else if (!banner?.imageUrl) {
            message.error('Please upload a banner image');
            return;
        }

        handleSubmit(formData, () => {
            form.resetFields();
            setFile(null);
            setFileList([]);
        });
    };

    return (
        <StyledBannerForm>
            <Form form={form} layout="vertical" onFinish={onFinish} className="form-style" style={{ width: "70vw" }}>
                <Form.Item label="Title" name="title" rules={[{ required: true }]}>
                    <Input className="input" maxLength={255} showCount placeholder="Enter title" />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true }]}
                    valuePropName="value"
                >
                    <ReactQuill theme="snow" modules={{
                        toolbar: [
                            [{ header: [1, 2, false] }],
                            ["bold", "italic", "underline", "strike"],
                            [{ list: "ordered" }, { list: "bullet" }],
                            ["link", "image"],
                        ],
                    }} style={{ borderRadius: 10 }}/>
                </Form.Item>

                <Form.Item label="Banner Image" required style={{ textAlign: "left" }}>
                    <Upload
                        beforeUpload={(file) => {
                            setFile(file);
                            setFileList([{
                                uid: file.name + Date.now(),
                                name: file.name,
                                status: 'done',
                                originFileObj: file
                            } as UploadFile]);
                            return false;
                        }}
                        fileList={fileList}
                        onRemove={() => {
                            setFile(null);
                            setFileList([]);
                        }}
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined />}>Select Image</Button>
                    </Upload>
                    {banner?.imageUrl && (
                        <div style={{ marginTop: 8 }}>
                            <small>Current image:</small>
                            <br />
                            <Image src={banner.imageUrl} alt="current banner" width={100} />
                        </div>
                    )}
                </Form.Item>

                <Form.Item style={{ textAlign: "right" }}>
                    <Button loading={isLoading} type="primary" htmlType="submit" block className="create-btn">
                        Save
                    </Button>
                </Form.Item>
            </Form>
        </StyledBannerForm>
    );
};

export default BannerEventForm;
