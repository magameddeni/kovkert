import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { useQuery } from '@tanstack/react-query'
import { CellContext, ColumnDef, SortingState } from '@tanstack/react-table'
import { IProductImages, IUser } from '@/models'
import { useQueryParams, useMessage, useCurrentSiteUrl } from '@/hooks'
import { Modal, Pagination, Text, Drawer, Search, Table, TableSkeleton, Icon } from '@/components/UI'
import { PageTabs } from '@/components/UI/pageElements'
import $api from '@/components/Http/axios'
import { copyText } from '@/utils/copyText'
import { useGetConnectedProducts } from '../../hooks'
import { PartnerDrawer } from '../partnerDrawer'
import { ChangeDiscountModal } from '../../modals/ChangeDiscountModal'
import { CheckModal } from '../../modals/CheckModal'
import { WriteOffModal } from '../../modals/WriteOffModal'
import s from './styles.module.scss'

type TSort =
  | 'productName_asc'
  | 'productName_desc'
  | 'discountPercentage_asc'
  | 'discountPercentage_desc'
  | 'createdAt_asc'
  | 'createdAt_desc'
  | 'endDate_asc'
  | 'endDate_desc'
  | 'status_asc'
  | 'status_desc'

interface ITab {
  name: string
  key: string
  labelKey: string
  labelColor?: 'red' | 'blue'
  disabled?: boolean
}

export enum PartnersTabKeys {
  Active = 'active',
  Archived = 'archived'
}

const tabs = [
  { name: 'Активные', key: PartnersTabKeys.Active },
  { name: 'Архив', key: PartnersTabKeys.Archived }
] as ITab[]

export interface TPartnerProgramList {
  _id: string
  program: string
  status: string
  createdAt: string
  user: IUser
}

const copyLink = (e: any, code: string) => {
  e.stopPropagation()
  const { siteUrl } = useCurrentSiteUrl(`/p/${code}`)
  void copyText(siteUrl)
  useMessage('Ссылка скопирована!', 'success', 'Готово')
}

const columns: ColumnDef<TPartnerProgramList>[] = [
  {
    accessorKey: 'index',
    header: '№',
    size: 65,
    enableSorting: false
  },
  {
    accessorKey: 'image',
    header: 'Товар',
    size: 58,
    minSize: 58,
    enableSorting: false,
    cell: (info: CellContext<TPartnerProgramList, unknown>) => {
      const image = info.getValue() as IProductImages
      return <img alt='product' src={image?.link} className={s['image-cell-wrapper']} />
    }
  },
  {
    accessorKey: 'name',
    header: '',
    minSize: 300
  },
  {
    accessorKey: 'discountPercentage',
    header: 'Скидка',
    size: 150,
    minSize: 150,
    cell: (info: CellContext<TPartnerProgramList, unknown>) => `${info?.getValue()}%`
  },
  {
    accessorKey: 'createdAt',
    header: 'Дата создания',
    size: 150,
    minSize: 150,
    cell: (info: CellContext<TPartnerProgramList, unknown>) => moment(info?.getValue() as string).format('DD.MM.YY')
  },
  {
    accessorKey: 'endDate',
    header: 'Срок действия',
    size: 150,
    minSize: 150,
    cell: (info: CellContext<TPartnerProgramList, unknown>) =>
      `до ${moment(info?.getValue() as string).format('DD.MM.YY')}`
  },
  {
    accessorKey: 'shortLinkCode',
    header: '',
    size: 65,
    cell: (info: CellContext<TPartnerProgramList, unknown>) => (
      <Icon onClick={(e) => copyLink(e, info?.getValue() as string)} color='gray-dark' name='duplicate' />
    )
  }
]

const DetailedTable: React.FC = () => {
  const { query, setQuery, deleteQuery } = useQueryParams()
  const [totalCount, setTotalCount] = useState<number>(0)
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0)
  const [sorting, setSorting] = useState<SortingState | undefined>(undefined)
  const [tabsCount, setTabsCount] = useState()
  const [affiliateLink, setAffiliateLink] = useState<any | undefined>(undefined)
  const [isChangeDiscountModalOpen, setIsChangeDiscountModalOpen] = useState<boolean>(false)
  const [isWriteOffModalModalOpen, setIsWriteOffModalModalOpen] = useState<boolean>(false)

  const handleSuccessGetTableData = (count: number) => setTotalCount(count)

  useQuery({
    queryKey: ['getProductsCount'],
    queryFn: async () => {
      const { data } = await $api.get(`/api/affiliate/links/count`)
      setTabsCount(data ?? {})
      return data
    }
  })

  const { programs = [], isLoading } = useGetConnectedProducts({
    onSuccess: handleSuccessGetTableData,
    enabled: [PartnersTabKeys.Active, PartnersTabKeys.Archived].includes(query.filter as PartnersTabKeys)
  })

  const setFirstPage = () => setQuery({ page: '1' })

  const onPaginationChange = (value: number) => setQuery({ page: value.toString() })

  const onSearchChange = (searchString: string) => {
    if (!searchString) return deleteQuery('text')
    setQuery({ text: searchString })
  }

  const onTabChange = (index: number) => {
    setQuery({ filter: tabs[index].key })
    setActiveTabIndex(index)
  }

  useEffect(() => {
    if (!query.filter) {
      void setQuery({ filter: tabs[0].key })
    }
  }, [query.filter])

  useEffect(() => {
    const sortQueryParams = query.sort

    if (sortQueryParams) {
      if (sortQueryParams === 'productName_asc') setSorting([{ id: 'name', desc: false }])
      if (sortQueryParams === 'productName_desc') setSorting([{ id: 'name', desc: true }])
      if (sortQueryParams === 'endDate_asc') setSorting([{ id: 'endDate', desc: false }])
      if (sortQueryParams === 'endDate_desc') setSorting([{ id: 'endDate', desc: true }])
      if (sortQueryParams === 'discountPercentage_asc') setSorting([{ id: 'discountPercentage', desc: false }])
      if (sortQueryParams === 'discountPercentage_desc') setSorting([{ id: 'discountPercentage', desc: true }])
      if (sortQueryParams === 'createdAt_asc') setSorting([{ id: 'createdAt', desc: false }])
      if (sortQueryParams === 'createdAt_desc') setSorting([{ id: 'createdAt', desc: true }])
      if (sortQueryParams === 'status_asc') setSorting([{ id: 'status', desc: false }])
      if (sortQueryParams === 'status_desc') setSorting([{ id: 'status', desc: true }])
    }
  }, [query])

  useEffect(() => {
    if (sorting) {
      const sortingKeys = {
        name: ['productName_asc', 'productName_desc'],
        endDate: ['endDate_asc', 'endDate_desc'],
        discountPercentage: ['discountPercentage_asc', 'discountPercentage_desc'],
        createdAt: ['createdAt_asc', 'createdAt_desc'],
        status: ['status_asc', 'status_desc']
      } as Record<string, TSort[]>

      const correctKey = sortingKeys?.[sorting?.[0]?.id]?.[sorting?.[0]?.desc ? 1 : 0]

      if (correctKey) {
        void setQuery({ sort: correctKey })
      } else {
        deleteQuery('sort')
      }

      setFirstPage()
    }
  }, [sorting])

  return (
    <div className={s.DetailedTable}>
      <div className={s['DetailedTable__header-wrapper']}>
        <div className={s.DetailedTable__header}>
          <PageTabs>
            {tabs.map((v: ITab, i: number) => (
              <PageTabs.Tab<number>
                key={v.name}
                tabKey={i}
                title={v.name}
                active={activeTabIndex}
                onChange={onTabChange}
                labelColor={v?.labelColor}
                disabled={v?.disabled}
                label={String((tabsCount as any)?.[v?.key] ?? 0)}
              />
            ))}
          </PageTabs>
          {query.filter && <Search onChange={onSearchChange} disabled={!programs?.length && !query.text} />}
        </div>
      </div>
      <div className={s.DetailedTable__content}>
        {isLoading ? (
          <TableSkeleton />
        ) : programs?.length ? (
          <Table<TPartnerProgramList>
            defaultData={programs || []}
            defaultColumns={columns}
            onSorting={setSorting}
            sorting={sorting || []}
            onRowClick={(data) => setAffiliateLink(data)}
            resize
            fluid
          />
        ) : (
          <Text as='p' className='offset-top-8'>
            Данных нет
          </Text>
        )}
      </div>
      {Boolean(programs?.length) && (
        <div className={s.products__footer}>
          <Pagination
            totalCount={totalCount}
            pageIndex={parseInt((query?.page as string) ?? '1', 10)}
            onPage={parseInt((query.limit as string) ?? '20', 10)}
            onChangeShowMore={onPaginationChange}
          />
        </div>
      )}
      <Modal size='sm' isOpen={isChangeDiscountModalOpen} onRequestClose={() => setIsChangeDiscountModalOpen(false)}>
        <ChangeDiscountModal
          programId={affiliateLink?.programId}
          affiliateLinkId={affiliateLink?._id}
          shopId={affiliateLink?.shopId}
          closeChangeDiscountModal={() => setIsChangeDiscountModalOpen(false)}
        />
      </Modal>
      <Modal size='sm' isOpen={!!query?.receipt} onRequestClose={() => deleteQuery('receipt')}>
        <CheckModal selectedWithdrawalId={query?.receipt as string} />
      </Modal>
      <Modal size='sm' isOpen={isWriteOffModalModalOpen} onRequestClose={() => setIsWriteOffModalModalOpen(false)}>
        <WriteOffModal
          programId={affiliateLink?.programId}
          affiliateLinkId={affiliateLink?._id}
          shopId={affiliateLink?.shopId}
        />
      </Modal>
      <Drawer
        show={Boolean(affiliateLink?._id)}
        onClose={() => setAffiliateLink(null)}
        width='613px'
        closeOnOutSide={false}
      >
        <PartnerDrawer
          programId={affiliateLink?.programId}
          affiliateLinkId={affiliateLink?._id}
          shopId={affiliateLink?.shopId}
          setIsChangeDiscountModalOpen={setIsChangeDiscountModalOpen}
          setIsWriteOffModalModalOpen={setIsWriteOffModalModalOpen}
        />
      </Drawer>
    </div>
  )
}

export default DetailedTable
